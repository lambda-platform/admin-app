export NODE_OPTIONS=--max-old-space-size=8192
npx nuxi generate
rm -R ../usug-back-end/public/admin
rm -R ../usug-back-end/public/auth
rm -R ../usug-back-end/public/lambda_admin
rm -R ../usug-back-end/public/form
mv .output/public/admin ../usug-back-end/public/admin
mv .output/public/auth ../usug-back-end/public/auth
mv .output/public/lambda_admin ../usug-back-end/public/lambda_admin
mv .output/public/form ../usug-back-end/public/form
