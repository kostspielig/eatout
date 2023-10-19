
FROM nixos/nix

COPY . /opt/eaout
WORKDIR /opt/eaout

ENV NIXPKGS_ALLOW_INSECURE=1
RUN nix-shell --run "echo prepare"

RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN nix-shell --run "make deps"

ENTRYPOINT nix-shell --run "make serve"
