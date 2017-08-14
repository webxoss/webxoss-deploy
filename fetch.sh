# env variables:
#   $ENV: test, alpha, beta
#   $DIST
#   $COMMIT_ID
#   $CLIENT_ID
#   $ASSETS_ID

mkdir -p /tmp/webxoss-deploy
cd /tmp/webxoss-deploy

# webxoss-core
URL=https://api.github.com/repos/webxoss/webxoss-core/tarball/$COMMIT_ID
FILE=webxoss-core-$COMMIT_ID.tar.gz
# Download
[ -f $FILE ] || curl -L -s -o $FILE.tmp $URL
mv $FILE.tmp $FILE
# Extract
mkdir -p $COMMIT_ID
tar xzf $FILE -C $COMMIT_ID --strip-components=1

# webxoss-client
URL=https://api.github.com/repos/webxoss/webxoss-client/tarball/$CLIENT_ID
FILE=webxoss-client-$CLIENT_ID.tar.gz
# Download
[ -f $FILE ] || curl -L -s -o $FILE.tmp $URL
mv $FILE.tmp $FILE
# Extract
tar xzf $FILE -C $COMMIT_ID/webxoss-client --strip-components=1

# webxoss-assets
URL=https://api.github.com/repos/webxoss/webxoss-assets/tarball/$ASSETS_ID
FILE=webxoss-assets-$ASSETS_ID.tar.gz
# Download
[ -f $FILE ] || curl -L -s -o $FILE.tmp $URL
mv $FILE.tmp $FILE
# Extract
tar xzf $FILE -C $COMMIT_ID/webxoss-client/background --strip-components=1

# Move
mkdir -p $DIST
rm -rf $DIST/$ENV
mv $COMMIT_ID $DIST/$ENV
