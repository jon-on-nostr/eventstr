export default function handler(req, res) {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.status(200).end();
      return;
    }
  
    // Set CORS headers for the actual response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    // Check if we're on www domain
    const host = req.headers.host || '';
    if (!host.startsWith('www.')) {
      // Redirect to www with CORS headers preserved
      res.setHeader('Location', `https://www.eventstr.com${req.url}`);
      res.status(308).end();
      return;
    }
  
    // Serve the actual JSON
    res.status(200).json({
      "names": {
        "jon": "cfc3f840b87c8e3ac26dd714a3c71c80a624fee0cced463f33810fb25ff97a96"
      }
    });
}