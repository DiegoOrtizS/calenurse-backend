module.exports = {
  apps: [{
    name: 'my-app',
    script: 'npm',
    args: 'run dev',
    watch: true,
    ignore_watch: ["node_modules"]
  }]
};
