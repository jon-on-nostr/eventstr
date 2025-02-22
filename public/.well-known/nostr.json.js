export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).json({
      "names": {
        "jon@eventstr.com": "cfc3f840b87c8e3ac26dd714a3c71c80a624fee0cced463f33810fb25ff97a96"
      }
    });
  }