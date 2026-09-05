const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const compression = require('compression');

const app = express();

// 1. SUPPRESS EXPOSURE HEADERS
app.disable('x-powered-by');

// 2. ENABLE PAYLOAD COMPRESSION (Gzip / Brotli)
app.use(compression({
  threshold: 1024, // Compress responses above 1KB
  level: 6,        // Balanced compression ratio vs CPU usage
}));

// 3. SECURITY HEADERS MIDDLEWARE
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});

app.use(cors());
app.use(express.json());

// Tech Stack & Visual Specs Detector
function analyzeTechAndDesign(headers, htmlContent) {
  const $ = cheerio.load(htmlContent || '');
  const lowerHtml = (htmlContent || '').toLowerCase();

  const frontendTech = [];
  const backendTech = [];
  const thirdPartyServices = [];
  const apisDetected = [];
  const fontFamilies = [];
  const colorPalette = new Set();

  if (lowerHtml.includes('react') || lowerHtml.includes('_next') || $('[id="__next"]').length > 0) {
    frontendTech.push('React.js / Next.js');
  }
  if (lowerHtml.includes('vue') || lowerHtml.includes('nuxt')) {
    frontendTech.push('Vue.js / Nuxt.js');
  }
  if (lowerHtml.includes('tailwind')) {
    frontendTech.push('Tailwind CSS');
  }
  if (lowerHtml.includes('bootstrap')) {
    frontendTech.push('Bootstrap');
  }
  if (frontendTech.length === 0) {
    frontendTech.push('HTML5 / Modern Frontend');
  }

  if (headers['x-powered-by']) backendTech.push(headers['x-powered-by']);
  if (headers['server']) backendTech.push('Server: ' + headers['server']);
  if (backendTech.length === 0) backendTech.push('Node.js / Cloudflare Proxy');

  if (lowerHtml.includes('google-analytics') || lowerHtml.includes('googletagmanager')) {
    thirdPartyServices.push('Google Tag Manager');
  }
  if (lowerHtml.includes('cloudflare') || headers['cf-ray']) {
    thirdPartyServices.push('Cloudflare CDN / Security Edge');
  }
  if (thirdPartyServices.length === 0) thirdPartyServices.push('Standard Static CDN');

  $('script').each((i, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('/api/') || src.includes('graphql')) apisDetected.push(src);
  });
  if (apisDetected.length === 0) apisDetected.push('REST Engine Services');

  if (lowerHtml.includes('fonts.googleapis.com')) fontFamilies.push('Google Fonts');
  if (lowerHtml.includes('inter')) fontFamilies.push('Inter');
  if (lowerHtml.includes('roboto')) fontFamilies.push('Roboto');
  if (fontFamilies.length === 0) fontFamilies.push('System UI Sans');

  const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
  const matches = htmlContent.match(hexRegex) || [];
  matches.slice(0, 5).forEach(color => colorPalette.add(color.toUpperCase()));

  if (colorPalette.size === 0) {
    colorPalette.add('#000000');
    colorPalette.add('#FFFFFF');
    colorPalette.add('#DC2626');
  }

  return {
    frontendTech,
    backendTech,
    thirdPartyServices,
    apisDetected: Array.from(new Set(apisDetected)),
    fontFamilies: Array.from(new Set(fontFamilies)),
    colorPalette: Array.from(colorPalette)
  };
}

// Audit Analyzer with Fixed Compression Detection
function analyzeAuditDetails(headers, rawResponseHeaders, isHttps, responseTime, htmlContent) {
  const securityIssues = [];
  const speedIssues = [];
  const responsivenessIssues = [];
  const codeFlaws = [];

  let securityScore = 100;
  let speedScore = 100;

  // 1. Security Analysis
  if (!isHttps) {
    securityScore -= 30;
    securityIssues.push({ issue: 'Insecure HTTP Connection', recommendation: 'Enable SSL/TLS.' });
  }
  if (!headers['content-security-policy']) {
    securityScore -= 20;
    securityIssues.push({ issue: 'Content-Security-Policy Missing', recommendation: 'Add CSP headers.' });
  }
  if (!headers['x-frame-options']) {
    securityScore -= 20;
    securityIssues.push({ issue: 'X-Frame-Options Missing', recommendation: 'Set X-Frame-Options to DENY or SAMEORIGIN.' });
  }

  // 2. Updated Compression Detection Logic
  const rawEncoding = rawResponseHeaders['content-encoding'] || headers['content-encoding'] || '';
  const isCompressed = rawEncoding.includes('gzip') || 
                       rawEncoding.includes('br') || 
                       rawEncoding.includes('deflate') ||
                       headers['transfer-encoding'] === 'chunked';

  if (!isCompressed) {
    speedScore -= 20;
    speedIssues.push({
      issue: 'Payload Compression Missed (Gzip / Brotli Not Detected)',
      recommendation: 'Enable Brotli Compression in Cloudflare (Speed -> Optimization) or Origin Server.'
    });
  }

  // 3. Speed & Latency Scoring
  if (responseTime > 1500) {
    speedScore -= 30;
    speedIssues.push({
      issue: `High Target Server Latency (${responseTime}ms)`,
      recommendation: 'Target TTFB is high. Enable Cloudflare Proxy (Orange Cloud) and Cache Everything rule.'
    });
  } else if (responseTime > 800) {
    speedScore -= 15;
    speedIssues.push({
      issue: `Moderate Latency (${responseTime}ms)`,
      recommendation: 'Optimize server database queries and use Edge Caching.'
    });
  }

  // 4. Cloudflare Proxy Check
  if (!headers['cf-ray'] && !headers['cf-cache-status']) {
    codeFlaws.push({
      flaw: 'Cloudflare Proxy (Orange Cloud) Inactive / Bypass',
      fix: 'Go to Cloudflare DNS -> Set A/CNAME record to "Proxied" (Orange Cloud icon).'
    });
  }

  const lowerHtml = (htmlContent || '').toLowerCase();
  if (!lowerHtml.includes('name="viewport"') && !lowerHtml.includes("name='viewport'")) {
    responsivenessIssues.push({
      issue: 'Viewport Meta Tag Missing',
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">.'
    });
  }

  return {
    securityScore: Math.max(0, securityScore),
    speedScore: Math.max(0, speedScore),
    securityIssues,
    speedIssues,
    responsivenessIssues,
    codeFlaws
  };
}

// POST Audit Endpoint
app.post('/api/audit', async (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const startTime = Date.now();
  const isHttps = url.startsWith('https://');

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      decompress: true
    });

    const responseTime = Date.now() - startTime;
    const headers = response.headers;
    const rawResponseHeaders = response.request?.res?.headers || headers;
    const htmlData = typeof response.data === 'string' ? response.data : '';

    const auditResults = analyzeAuditDetails(headers, rawResponseHeaders, isHttps, responseTime, htmlData);
    const techAndDesign = analyzeTechAndDesign(headers, htmlData);

    return res.json({
      id: Date.now().toString(),
      url,
      status: response.status < 400 ? 'ONLINE' : 'OFFLINE',
      statusCode: response.status,
      responseTimeMs: responseTime,
      isHttps,
      ...auditResults,
      ...techAndDesign,
      timestamp: new Date().toLocaleTimeString()
    });

  } catch (error) {
    return res.json({
      id: Date.now().toString(),
      url,
      status: 'OFFLINE',
      statusCode: 500,
      responseTimeMs: Date.now() - startTime,
      isHttps,
      securityScore: 0,
      speedScore: 0,
      securityIssues: [{ issue: 'Unreachable Domain', recommendation: 'Verify DNS status.' }],
      speedIssues: [{ issue: 'Connection Timeout', recommendation: 'Server down or blocked.' }],
      responsivenessIssues: [{ issue: 'Site Unreachable', fix: 'Server offline.' }],
      codeFlaws: [{ flaw: 'Connection Error', fix: 'Check network routing.' }],
      frontendTech: ['Unknown'],
      backendTech: ['Unknown'],
      thirdPartyServices: ['None'],
      apisDetected: ['None'],
      fontFamilies: ['Unknown'],
      colorPalette: ['#000000', '#DC2626'],
      timestamp: new Date().toLocaleTimeString()
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`DevMetrics Engine running on port ${PORT}`));