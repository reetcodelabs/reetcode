#!/bin/sh

set -e

if ! command -v unzip >/dev/null; then
	echo "Error: unzip is required to install Reetcode CLI (see: https://reetcode.com/blog/reetcode-cli#unzip-is-required )." 1>&2
	exit 1
fi

if [ "$OS" = "Windows_NT" ]; then
	target="x86_64-pc-windows-msvc"
else
	case $(uname -sm) in
	"Darwin x86_64") target="x86_64-apple-darwin" ;;
	"Darwin arm64") target="aarch64-apple-darwin" ;;
	"Linux aarch64")
		echo "We do not have support for your operating system yet. Please try using our docker image or similar." 1>&2
		exit 1
		;;
	*) target="x86_64-unknown-linux-gnu" ;;
	esac
fi

download_uri="https://reetcode.com/cli/build/${target}.zip"

reetcode_install="${REETCODE_INSTALL:-$HOME/.reetcode}"
bin_dir="$reetcode_install/bin"
exe="$bin_dir/reetcode"

if [ ! -d "$bin_dir" ]; then
	mkdir -p "$bin_dir"
fi

curl --fail --location --progress-bar --output "$exe.zip" "$download_uri"
unzip -d "$bin_dir" -o "$exe.zip"
chmod +x "$exe"
rm "$exe.zip"

echo "Reetcode CLI was installed successfully to $exe"

if command -v reetcode >/dev/null; then
	echo "Run 'reetcode --help' to get started"
else
	case $SHELL in
	/bin/zsh) shell_profile=".zshrc" ;;
	*) shell_profile=".bashrc" ;;
	esac
	echo "Manually add the directory to your \$HOME/$shell_profile (or similar)"
	echo "  export REETCODE_INSTALL=\"$reetcode_install\""
	echo "  export PATH=\"\$REETCODE_INSTALL/bin:\$PATH\""
	echo "Run '$exe --help' to get started"
fi
echo

echo "Stuck? Join our Discord https://discord.gg/reetcode"
