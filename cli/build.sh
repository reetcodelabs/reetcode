echo "Cleanup build folders..."
rm -rf build
rm -rf ../public/cli/build

echo "Compiling for mac OS..."

deno compile --allow-net --allow-read --allow-write --allow-run main.ts --target=x86_64-apple-darwin --output=build/x86_64-apple-darwin/reetcode

zip -j build/x86_64-apple-darwin.zip build/x86_64-apple-darwin/reetcode

rm -rf build/x86_64-apple-darwin

echo "Compiling for mac OS M series..."
deno compile --allow-net --allow-read --allow-write --allow-run main.ts --target=aarch64-apple-darwin --output=build/aarch64-apple-darwin/reetcode

zip -j build/aarch64-apple-darwin.zip build/aarch64-apple-darwin/reetcode

rm -rf build/aarch64-apple-darwin

echo "Compiling for windows..."
deno compile --allow-net --allow-read --allow-write --allow-run main.ts --target=x86_64-pc-windows-msvc --output=build/x86_64-pc-windows-msvc/reetcode

zip -j build/x86_64-pc-windows-msvc.zip build/x86_64-pc-windows-msvc/reetcode.exe

rm -rf build/x86_64-pc-windows-msvc

echo "Compiling for Linux..."
deno compile --allow-net --allow-read --allow-write --allow-run main.ts --target=x86_64-unknown-linux-gnu --output=build/x86_64-unknown-linux-gnu/reetcode

zip -j build/x86_64-unknown-linux-gnu.zip build/x86_64-unknown-linux-gnu/reetcode

rm -rf build/x86_64-unknown-linux-gnu

echo "Copying builds to next public folder.."

cp -a build/ ../public/cli/build
