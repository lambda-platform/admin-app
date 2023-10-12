export NODE_OPTIONS=--max-old-space-size=8192
npx nuxi generate
rm -R ../back-end/public/admin
rm -R ../back-end/public/auth
rm -R ../back-end/public/lambda_admin
rm -R ../back-end/public/form
mv .output/public/admin ../back-end/public/admin
mv .output/public/auth ../back-end/public/auth
mv .output/public/lambda_admin ../back-end/public/lambda_admin
mv .output/public/form ../back-end/public/form
