# Bitbank realtime data
BitbankのAPIデータを基にデプスチャート、歩み値を表示

## web site url
XRP/JPYに対応しています。
https://bb-realtimedata.firebaseapp.com/

## Require
- Node.js version 8.9 or above (8.11.0+ recommended)
- Yarn
- @vue/cli (`yarn global add @vue/cli`)


## Project setup
必要な依存関係が不足している可能性があります。
問題があればご連絡ください。
```
yarn install
```

### Compiles and hot-reloads for development
開発マシン環境の都合上、ポート4000設定としております。
```
yarn run serve
```

### Compiles and minifies for production
Firebase Hostingなど、お好きな静的ホスティングサービスにデプロイが可能です。
ビルド後、distディレクトリをターゲットとします。
```
yarn run build
```
