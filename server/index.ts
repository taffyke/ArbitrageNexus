const port = 5000;
server.listen({
  port,
  host: "localhost",
  reusePort: true,
}, () => {
  log(`serving on port ${port}`);
}); 