import os

# Define assets directory
assets_dir = r"C:\Users\radun\.gemini\antigravity\scratch\the-creative-bunch-website\assets"
os.makedirs(assets_dir, exist_ok=True)

# Color variables from the brand palette
c_bg = "#200B20"
c_lavender = "#E5E2FF"
c_lime = "#E2FF9D"
c_slate = "#507679"
c_terracotta = "#946459"

# Helper to write SVG file
def write_svg(filename, content):
    filepath = os.path.join(assets_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated {filename}")

# --- TEAM MEMBER PLACEHOLDERS ---
team_svgs = {
    "team_member1.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="{c_bg}"/>
        <circle cx="200" cy="180" r="80" fill="{c_lime}" opacity="0.8"/>
        <path d="M100 320 C100 240, 300 240, 300 320" fill="none" stroke="{c_lavender}" stroke-width="8" stroke-linecap="round"/>
        <text x="200" y="370" font-family="'Unbounded', sans-serif" font-weight="bold" font-size="28" fill="{c_lavender}" text-anchor="middle">AVI</text>
        <circle cx="200" cy="180" r="100" fill="none" stroke="{c_slate}" stroke-width="2" stroke-dasharray="10 15"/>
        <polygon points="200,60 210,85 235,95 210,105 200,130 190,105 165,95 190,85" fill="{c_terracotta}"/>
    </svg>""",
    "team_member2.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="{c_bg}"/>
        <rect x="130" y="110" width="140" height="140" rx="30" fill="{c_lavender}" opacity="0.8"/>
        <path d="M90 320 C90 250, 310 250, 310 320" fill="none" stroke="{c_lime}" stroke-width="8" stroke-linecap="round"/>
        <text x="200" y="370" font-family="'Unbounded', sans-serif" font-weight="bold" font-size="28" fill="{c_lime}" text-anchor="middle">DAVID</text>
        <circle cx="200" cy="180" r="110" fill="none" stroke="{c_terracotta}" stroke-width="3"/>
        <line x1="200" y1="50" x2="200" y2="310" stroke="{c_slate}" stroke-width="1.5" stroke-dasharray="8 8"/>
        <line x1="50" y1="180" x2="350" y2="180" stroke="{c_slate}" stroke-width="1.5" stroke-dasharray="8 8"/>
    </svg>""",
    "team_member3.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="{c_bg}"/>
        <polygon points="200,100 270,220 130,220" fill="{c_terracotta}" opacity="0.8"/>
        <path d="M100 320 C100 250, 300 250, 300 320" fill="none" stroke="{c_lavender}" stroke-width="8" stroke-linecap="round"/>
        <text x="200" y="370" font-family="'Unbounded', sans-serif" font-weight="bold" font-size="28" fill="{c_lavender}" text-anchor="middle">SARAH</text>
        <circle cx="200" cy="190" r="75" fill="none" stroke="{c_lime}" stroke-width="4"/>
        <path d="M150 150 L250 250 M250 150 L150 250" stroke="{c_slate}" stroke-width="2" stroke-dasharray="5 5"/>
    </svg>""",
    "team_member4.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="{c_bg}"/>
        <path d="M200 90 L280 170 L200 250 L120 170 Z" fill="{c_slate}" opacity="0.8"/>
        <path d="M110 320 C110 250, 290 250, 290 320" fill="none" stroke="{c_lime}" stroke-width="8" stroke-linecap="round"/>
        <text x="200" y="370" font-family="'Unbounded', sans-serif" font-weight="bold" font-size="28" fill="{c_lime}" text-anchor="middle">NOAM</text>
        <circle cx="200" cy="170" r="90" fill="none" stroke="{c_lavender}" stroke-width="3" stroke-dasharray="2 10"/>
        <rect x="175" y="145" width="50" height="50" fill="none" stroke="{c_lime}" stroke-width="4"/>
    </svg>"""
}

# --- PROJECT PORTFOLIO SVGS (16:10 aspect ratio - 800x500) ---
project_svgs = {
    "project_chabad.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" fill="{c_bg}"/>
        <circle cx="400" cy="250" r="160" fill="none" stroke="{c_lime}" stroke-width="2" stroke-dasharray="12 12"/>
        <circle cx="400" cy="250" r="120" fill="none" stroke="{c_lavender}" stroke-width="4"/>
        <!-- Abstract Star of David representation in branding colors -->
        <polygon points="400,120 490,280 310,280" fill="none" stroke="{c_lime}" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="400,380 490,220 310,220" fill="none" stroke="{c_lime}" stroke-width="6" stroke-linejoin="round"/>
        <!-- Futuristic Grid background -->
        <path d="M 0,100 L 800,100 M 0,200 L 800,200 M 0,300 L 800,300 M 0,400 L 800,400 M 160,0 L 160,500 M 320,0 L 320,500 M 480,0 L 480,500 M 640,0 L 640,500" stroke="{c_slate}" stroke-width="0.5" opacity="0.3"/>
        <text x="70" y="440" font-family="'Unbounded', sans-serif" font-weight="900" font-size="32" fill="{c_lavender}">CHABAD</text>
        <text x="70" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="16" fill="{c_slate}" letter-spacing="2">COMMUNITY WEB</text>
    </svg>""",
    
    "project_bnei.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" fill="{c_bg}"/>
        <!-- Dynamic overlapping geometric waves for youth campaign -->
        <path d="M -100,250 C 100,400 300,100 500,350 C 650,450 750,200 900,300" fill="none" stroke="{c_lime}" stroke-width="12" stroke-linecap="round"/>
        <path d="M -100,300 C 150,150 250,450 450,250 C 600,100 700,350 900,200" fill="none" stroke="{c_terracotta}" stroke-width="8" stroke-linecap="round"/>
        <path d="M -100,200 C 50,300 200,200 400,400 C 600,200 750,300 900,150" fill="none" stroke="{c_lavender}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="200" cy="150" r="40" fill="{c_lime}"/>
        <circle cx="600" cy="350" r="60" fill="none" stroke="{c_lavender}" stroke-width="3"/>
        <text x="70" y="440" font-family="'Unbounded', sans-serif" font-weight="900" font-size="32" fill="{c_lime}">BNEI AKIVA</text>
        <text x="70" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="16" fill="{c_slate}" letter-spacing="2">CAMPAIGN PACK</text>
    </svg>""",
    
    "project_kosher.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" fill="{c_bg}"/>
        <rect x="250" y="100" width="300" height="300" rx="40" fill="none" stroke="{c_slate}" stroke-width="2" stroke-dasharray="10 10"/>
        <!-- Modern packaging mock line -->
        <g transform="translate(400, 240)">
            <rect x="-80" y="-80" width="160" height="160" rx="30" fill="{c_terracotta}" opacity="0.9"/>
            <circle cx="0" cy="0" r="45" fill="{c_lime}"/>
            <path d="M -20,-10 L 0,-30 L 20,-10 L 10,25 L -10,25 Z" fill="{c_bg}"/>
        </g>
        <text x="70" y="440" font-family="'Unbounded', sans-serif" font-weight="900" font-size="32" fill="{c_lavender}">KOSHER</text>
        <text x="70" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="16" fill="{c_lime}" letter-spacing="2">EXPRESS PACKAGING</text>
    </svg>""",
    
    "project_museum.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" fill="{c_bg}"/>
        <!-- Interactive UI wires/nodes -->
        <circle cx="150" cy="150" r="20" fill="{c_lime}"/>
        <circle cx="400" cy="200" r="40" fill="{c_lavender}" opacity="0.8"/>
        <circle cx="650" cy="150" r="20" fill="{c_lime}"/>
        <circle cx="250" cy="320" r="30" fill="{c_terracotta}"/>
        <circle cx="550" cy="320" r="30" fill="{c_slate}"/>
        <line x1="150" y1="150" x2="400" y2="200" stroke="{c_lavender}" stroke-width="3"/>
        <line x1="650" y1="150" x2="400" y2="200" stroke="{c_lavender}" stroke-width="3"/>
        <line x1="400" y1="200" x2="250" y2="320" stroke="{c_slate}" stroke-width="2"/>
        <line x1="400" y1="200" x2="550" y2="320" stroke="{c_slate}" stroke-width="2"/>
        <line x1="250" y1="320" x2="550" y2="320" stroke="{c_lime}" stroke-width="1.5" stroke-dasharray="10 10"/>
        <text x="70" y="440" font-family="'Unbounded', sans-serif" font-weight="900" font-size="32" fill="{c_lime}">MUSEUM</text>
        <text x="70" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="16" fill="{c_slate}" letter-spacing="2">AUDIO APP UI</text>
    </svg>""",
    
    "project_shabbat.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" fill="{c_bg}"/>
        <!-- Sunburst & Candle flame layout -->
        <path d="M 400,200 L 400,380" stroke="{c_lime}" stroke-width="12" stroke-linecap="round"/>
        <path d="M 430,230 L 430,350" stroke="{c_slate}" stroke-width="8" stroke-linecap="round"/>
        <path d="M 370,230 L 370,350" stroke="{c_slate}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="400" cy="130" r="30" fill="{c_terracotta}"/>
        <path d="M400,80 C370,120 400,160 400,160 C400,160 430,120 400,80 Z" fill="{c_lime}"/>
        <text x="70" y="440" font-family="'Unbounded', sans-serif" font-weight="900" font-size="32" fill="{c_lavender}">SHABBAT</text>
        <text x="70" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="16" fill="{c_slate}" letter-spacing="2">SOCIAL MEDIA KIT</text>
    </svg>""",
    
    "project_branding.svg": f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" fill="{c_bg}"/>
        <!-- Secondary branding spiral / C-heart-spiral big representation -->
        <g transform="translate(400, 200) scale(2)">
            <path d="M35 10 C15 -5, -5 5, -5 30 C-5 55, 15 65, 35 50 C45 40, 40 25, 30 25 C20 25, 15 35, 25 40 C30 42, 35 40, 35 35" fill="none" stroke="{c_lime}" stroke-width="5" stroke-linecap="round"/>
        </g>
        <text x="70" y="440" font-family="'Unbounded', sans-serif" font-weight="900" font-size="32" fill="{c_lime}">CREATIVE BUNCH</text>
        <text x="70" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="16" fill="{c_slate}" letter-spacing="2">BRAND SYSTEM</text>
    </svg>"""
}

# Write SVGs
for fn, content in team_svgs.items():
    write_svg(fn, content)

for fn, content in project_svgs.items():
    write_svg(fn, content)

print("All assets successfully generated!")
