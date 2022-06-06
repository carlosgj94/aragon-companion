# Specifying ONLY the node packages that we need to install via browserify
# (because those aren't available in react native) and some of our deps require
# them. If we don't specify which packages, rn-nodeify  will look into each
# package.json and install everything including a bunch devDeps that we don't
# need like "console"
rn-nodeify --install --hack 'crypto,buffer,react-native-randombytes,vm,stream,http,https,os,url,net,fs,process'
echo "✅ rn-nodeify packages hacked succesfully"

# Apply patches.
patch-package
echo "✅ All patches applied"
