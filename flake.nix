{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    git-hooks-nix = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
    systems.url = "github:nix-systems/default";
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;
      imports = [
        inputs.treefmt-nix.flakeModule
        inputs.git-hooks-nix.flakeModule
      ];
      perSystem =
        {
          pkgs,
          lib,
          ...
        }:
        let
          name = "msn-show-source";
          pname = name;
          src = ./.;
          buildNpmPackage = pkgs.buildNpmPackage;
          importNpmLock = pkgs.importNpmLock;
          nodejs = pkgs.nodejs;

          meta = {
            description = "Userscript to add the source article to MSN News";
            homepage = "https://github.com/elanora96/msn-show-source";
            license = lib.licenses.isc;
            maintainers = with lib.maintainers; [ elanora96 ];
            platforms = lib.platforms.all;
          };
        in
        {
          packages.default = buildNpmPackage {
            inherit
              name
              pname
              src
              meta
              ;
            npmDeps = importNpmLock { npmRoot = src; };
            npmConfigHook = importNpmLock.npmConfigHook;
            buildInputs = [ nodejs ];
            installPhase = ''
              mkdir -p $out
              cp -r ./dist $out/dist
            '';
          };

          devShells.default = pkgs.mkShell {
            packages = [
              importNpmLock.hooks.linkNodeModulesHook
              nodejs
            ];
            npmDeps = importNpmLock.buildNodeModules {
              npmRoot = src;
              inherit nodejs;
            };
          };

          pre-commit.settings.hooks = {
            treefmt.enable = true;
          };

          treefmt = {
            projectRootFile = "flake.nix"; # Used to find the project root
            programs = {
              biome = {
                enable = true;
                settings = builtins.fromJSON (builtins.readFile ./biome.json);
              };
              nixfmt.enable = true;
            };
          };
        };
    };
}
