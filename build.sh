export NODE_OPTIONS=--max-old-space-size=8192
npx nuxi generate
rm -R ../Tatatonga/public/admin
rm -R ../Tatatonga/public/auth
rm -R ../Tatatonga/public/lambda_admin
rm -R ../Tatatonga/public/form
mv .output/public/admin ../Tatatonga/public/admin
mv .output/public/auth ../Tatatonga/public/auth
mv .output/public/lambda_admin ../Tatatonga/public/lambda_admin
mv .output/public/form ../Tatatonga/public/form
