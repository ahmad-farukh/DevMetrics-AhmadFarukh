const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const compression = require('compression');

const app = express();

app.disable('x-powered-by');

app.use(
  compression({
    threshold: 1024,
    level: 6
  })
);

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  next();
});

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('DevMetrics Engine is online and ready!');
});

function analyzeTechAndDesign(headers, htmlContent) {
  const $ = cheerio.load(htmlContent || '');
  const lowerHtml = (htmlContent || '').toLowerCase();

  const frontendTech = [];
  const backendTech = [];
  const thirdPartyServices = [];
  const apisDetected = [];
  const fontFamilies = [];
  const colorPalette = new Set();

  if (
    lowerHtml.includes('react') ||
    lowerHtml.includes('_next') ||
    $('#__next').length > 0
  ) {
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
    frontendTech.push('HTML5 / Modern Web Engine');
  }

  if (headers['x-powered-by']) {
    backendTech.push(headers['x-powered-by']);
  }

  if (headers['server']) {
    backendTech.push('Server: ' + headers['server']);
  }

  if (backendTech.length === 0) {
    backendTech.push('Node.js / Cloudflare Proxy');
  }

  if (
    lowerHtml.includes('google-analytics') ||
    lowerHtml.includes('googletagmanager')
  ) {
    thirdPartyServices.push('Google Tag Manager');
  }

  if (lowerHtml.includes('cloudflare') || headers['cf-ray']) {
    thirdPartyServices.push('Cloudflare CDN / Security Edge');
  }

  if (thirdPartyServices.length === 0) {
    thirdPartyServices.push('Standard Static CDN');
  }

  $('script').each((i, el) => {
    const src = $(el).attr('src') || '';

    if (src.includes('/api/') || src.includes('graphql')) {
      apisDetected.push(src);
    }
  });

  if (apisDetected.length === 0) {
    apisDetected.push('REST Engine Services');
  }

  if (lowerHtml.includes('fonts.googleapis.com')) {
    fontFamilies.push('Google Fonts');
  }

  if (lowerHtml.includes('inter')) {
    fontFamilies.push('Inter');
  }

  if (lowerHtml.includes('roboto')) {
    fontFamilies.push('Roboto');
  }

  if (fontFamilies.length === 0) {
    fontFamilies.push('System UI Sans');
  }

  const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
  const matches = (htmlContent || '').match(hexRegex) || [];

  matches.slice(0, 5).forEach((color) => {
    colorPalette.add(color.toUpperCase());
  });

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

function calculateSpeedScore(
  responseTime,
  htmlContent,
  scriptCount,
  stylesheetCount,
  headers
) {
  let score = 100;

  const htmlSizeKB = Buffer.byteLength(htmlContent || '', 'utf8') / 1024;

  // Server response time
  if (responseTime <= 200) {
    score -= 0;
  } else if (responseTime <= 400) {
    score -= 8;
  } else if (responseTime <= 600) {
    score -= 18;
  } else if (responseTime <= 800) {
    score -= 28;
  } else if (responseTime <= 1200) {
    score -= 40;
  } else if (responseTime <= 2000) {
    score -= 55;
  } else if (responseTime <= 3000) {
    score -= 70;
  } else {
    score -= 80;
  }

  // HTML document size
  if (htmlSizeKB > 500) {
    score -= 10;
  } else if (htmlSizeKB > 300) {
    score -= 7;
  } else if (htmlSizeKB > 150) {
    score -= 4;
  }

  // Number of JavaScript files
  if (scriptCount > 30) {
    score -= 10;
  } else if (scriptCount > 20) {
    score -= 7;
  } else if (scriptCount > 10) {
    score -= 4;
  }

  // Number of stylesheets
  if (stylesheetCount > 15) {
    score -= 7;
  } else if (stylesheetCount > 10) {
    score -= 5;
  } else if (stylesheetCount > 5) {
    score -= 2;
  }

  // Compression check
  const contentEncoding = headers['content-encoding'];

  if (!contentEncoding) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function analyzeAuditDetails(
  headers,
  rawResponseHeaders,
  isHttps,
  responseTime,
  htmlContent
) {
  const securityIssues = [];
  const speedIssues = [];
  const responsivenessIssues = [];
  const codeFlaws = [];

  let securityScore = 100;

  const $ = cheerio.load(htmlContent || '');

  const scriptCount = $('script').length;
  const stylesheetCount = $('link[rel="stylesheet"]').length;

  const speedScore = calculateSpeedScore(
    responseTime,
    htmlContent,
    scriptCount,
    stylesheetCount,
    headers
  );

  if (!isHttps) {
    securityScore -= 30;

    securityIssues.push({
      issue: 'Insecure HTTP Connection',
      recommendation: 'Enable SSL/TLS certificate.'
    });
  }

  if (!headers['content-security-policy']) {
    securityScore -= 15;

    securityIssues.push({
      issue: 'Missing Content-Security-Policy',
      recommendation: 'Implement CSP headers to prevent XSS.'
    });
  }

  if (!headers['strict-transport-security']) {
    securityScore -= 15;

    securityIssues.push({
      issue: 'HSTS Disabled',
      recommendation: 'Enable Strict-Transport-Security.'
    });
  }

  // Speed recommendations
  if (responseTime > 800) {
    speedIssues.push({
      issue: 'High Server Response Time',
      recommendation: 'Optimize backend query speed and caching.'
    });
  } else if (responseTime > 400) {
    speedIssues.push({
      issue: 'Moderate Server Latency',
      recommendation: 'Consider CDN edge caching and server optimization.'
    });
  }

  const htmlSizeKB = Buffer.byteLength(htmlContent || '', 'utf8') / 1024;

  if (htmlSizeKB > 300) {
    speedIssues.push({
      issue: 'Large HTML Document',
      recommendation: 'Reduce HTML payload size and remove unnecessary markup.'
    });
  }

  if (scriptCount > 20) {
    speedIssues.push({
      issue: 'High JavaScript File Count',
      recommendation: 'Bundle, defer, and remove unnecessary JavaScript files.'
    });
  }

  if (stylesheetCount > 10) {
    speedIssues.push({
      issue: 'High Stylesheet Count',
      recommendation: 'Combine and optimize CSS resources.'
    });
  }

  const viewport = $('meta[name="viewport"]').attr('content');

  if (!viewport) {
    responsivenessIssues.push({
      issue: 'Missing Viewport Meta Tag',
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> tag.'
    });
  }

  if (headers['x-powered-by']) {
    codeFlaws.push({
      flaw: 'Server Tech Disclosed in Header',
      fix: 'Disable x-powered-by header in backend.'
    });
  }

  return {
    securityScore: Math.max(0, securityScore),
    speedScore,
    securityIssues,
    speedIssues,
    responsivenessIssues,
    codeFlaws,

    seo: {
      metaDescription:
        $('meta[name="description"]').attr('content') ||
        'No description found',

      hasOgImage: !!$('meta[property="og:image"]').attr('content'),

      hasOgTitle: !!$('meta[property="og:title"]').attr('content')
    },

    assetBreakdown: {
      scriptCount,
      stylesheetCount
    }
  };
}

app.post('/api/audit', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: 'URL parameter is required.'
    });
  }

  const startTime = Date.now();

  const isHttps = url.startsWith('https://');

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'DevMetrics-Bot/1.0'
      }
    });

    const responseTime = Date.now() - startTime;

    const headers = response.headers || {};
    const htmlData = response.data || '';

    const auditResults = analyzeAuditDetails(
      headers,
      {},
      isHttps,
      responseTime,
      htmlData
    );

    const techAndDesign = analyzeTechAndDesign(
      headers,
      htmlData
    );

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
      statusCode: error.response?.status || 500,
      responseTimeMs: Date.now() - startTime,
      isHttps,

      securityScore: 0,
      speedScore: 0,

      securityIssues: [
        {
          issue: 'Unreachable Domain',
          recommendation: 'Verify DNS status or firewall rules.'
        }
      ],

      speedIssues: [
        {
          issue: 'Connection Timeout',
          recommendation: 'Server down or blocking bot requests.'
        }
      ],

      responsivenessIssues: [
        {
          issue: 'Site Unreachable',
          fix: 'Verify host availability.'
        }
      ],

      codeFlaws: [
        {
          flaw: 'Connection Error',
          fix: 'Check server routing.'
        }
      ],

      frontendTech: ['Unknown'],
      backendTech: ['Unknown'],
      thirdPartyServices: ['None'],
      apisDetected: ['None'],
      fontFamilies: ['System Sans'],
      colorPalette: ['#000000', '#FFFFFF', '#DC2626'],

      timestamp: new Date().toLocaleTimeString()
    });
  }
});

module.exports = app;