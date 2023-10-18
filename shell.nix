{
  rev     ? "5a237aecb57296f67276ac9ab296a41c23981f56", # nixos-23.05
  sha256  ? "166yxg4ff2jxvl9mbngd90dr1k3rdj6xmiccga41xynhh2zr0vmb",
  nixpkgs ? builtins.fetchTarball {
    name   = "nixpkgs-${rev}";
    url    = "https://github.com/arximboldi/nixpkgs/archive/${rev}.tar.gz";
    sha256 = sha256;
  },
}:

with import nixpkgs {};

let
  pkgs_node = import (builtins.fetchTarball {
    name = "nixpkgs_nodejs-10";
    url = "https://github.com/nixos/nixpkgs/archive/3c8a5fa9a699d6910bbe70490918f1a4adc1e462.tar.gz";
    sha256 = "0rfvz9nnsb10vv70k71di3asbap056pz1sg0si72xkmg5a66j2lc";
  }) {};

  pkgs_go = import (builtins.fetchTarball {
    name = "nixpkgs_go-1.7";
    url = "https://github.com/nixos/nixpkgs/archive/28e0126876d688cf5fd15da1c73fbaba256574f0.tar.gz";
    sha256 = "0wh3zwj9zvypkj0f7xqw76phhag9ys7vlsp6ixv90br52m61x4v4";
  }) {};

in
stdenv.mkDerivation {
  name = "eatout-env";
  NIX_PATH="nixpkgs=${path}";
  buildInputs = [
    pkgs_go.go_1_7
    pkgs_node.nodePackages.bower
    pkgs_node.nodejs-10_x
    python2
  ];
  shellHook = ''
    export EATOUT_ROOT=`dirname ${toString ./shell.nix}`
    addToSearchPath PATH "$EATOUT_ROOT/node_modules/.bin"
  '';
}
