const BlogTest = () => {
  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Blog Test</h2>
          <p className="text-xl text-muted-foreground">
            This is a minimal test to ensure the blog section renders.
          </p>
        </div>
        
        <div className="bg-muted p-8 rounded-lg text-center">
          <p>Blog section is working! The error was in the complex Blog component.</p>
        </div>
      </div>
    </section>
  );
};

export default BlogTest;
