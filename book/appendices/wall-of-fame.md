---
title: "Wall of Fame"
category: "Appendices"
summary: "Honoring the pioneers and contributors who shaped Robocode's strategies, documentation, and community."
tags: [ "credits", "community", "history", "beginner", "robocode", "tank-royale" ]
difficulty: "beginner"
source: [
  "RoboWiki - Contributors https://robowiki.net/",
  "Robocode Tank Royale Docs https://robocode.dev/"
]
---

# Wall of Fame

Robocode's rich strategic depth exists because of dedicated community members who spent years developing, documenting,
and sharing their discoveries. This page honors those who shaped the game's competitive landscape.

## The Pioneers

### Peter Strömberg (PEZ)

[RoboWiki User Page](https://robowiki.net/wiki/User:PEZ)  
Founder and original administrator of the [RoboWiki](https://robowiki.net/). Creator of legendary bots
**[CassiusClay](https://robowiki.net/wiki/CassiusClay)** and **[Pugilist](https://robowiki.net/wiki/Pugilist)**. PEZ was
instrumental in building the collaborative community culture and co-founded the wiki with Crippa in January 2003.

### Crippa

[RoboWiki User Page](https://robowiki.net/wiki/User:Crippa)  
Co-founder of the RoboWiki. In January 2003, Crippa and PEZ created the wiki as a private site before opening it to the
public to serve as the community's central knowledge hub.

### Julian Kent (Skilgannon)

[RoboWiki User Page](https://robowiki.net/wiki/User:Skilgannon)  
Author of **[DrussGT](https://robowiki.net/wiki/DrussGT)**, one of the most dominant bots in history. Skilgannon 
perfected **[Dynamic Clustering](https://robowiki.net/wiki/Dynamic_Clustering)** (originally pioneered by ABC), moving 
away from fixed "bins" toward a "nearest neighbor" search (K-Nearest Neighbor). He also advanced melee strategies and 
is the primary administrator and developer of the modern **[LiteRumble](https://robowiki.net/wiki/LiteRumble)** 
ranking system.

### Paul Evans

[RoboWiki User Page](https://robowiki.net/wiki/User:Paul_Evans)  
Creator of **[SandboxDT](https://robowiki.net/wiki/SandboxDT)**. Paul Evans is a co-pioneer of
**[GuessFactor Targeting](https://robowiki.net/wiki/GuessFactor_Targeting)**, discovering the concept of "bins" 
(statistical buckets) to track enemy movement. He also popularized **Segmentation**—showing that you should have 
different stats for "Close Range," "Long Range," "Near Walls," etc. His work in the early 2000s set the standard for 
statistical targeting that remains the foundation of high-level competitive play today.

### David Alves

[RoboWiki User Page](https://robowiki.net/wiki/User:David_Alves)  
Author of **[Phoenix](https://robowiki.net/wiki/Phoenix)** and **[Falcon](https://robowiki.net/wiki/Falcon)**. David 
Alves **invented the Wave concept**—realizing that since bullets travel at a constant speed, you can create an 
abstract "circle" expanding from the shooter, and when it hits the target, you know exactly what the GuessFactor was. 
This is the foundation for almost all modern bot data collection. Along with Paul Evans, he co-pioneered 
**[GuessFactor Targeting](https://robowiki.net/wiki/GuessFactor_Targeting)**, formalizing the math of Waves to track 
when bins should be updated. He also pioneered **[Pattern Matching](https://robowiki.net/wiki/Pattern_Matching)** 
with **[Phoenix](https://robowiki.net/wiki/Phoenix)**, creating the first dominant high-level targeting strategy by 
storing enemy movement as a string of characters and searching for "repeats" to predict the future. Additionally, 
David pioneered **Random Orbital Movement** to defeat Linear/Circular targeting.

### Patrick Cupka (Voidious)

[RoboWiki User Page](https://robowiki.net/wiki/User:Voidious)  
Author of **[Dookious](https://robowiki.net/wiki/Dookious)**. Voidious is credited with refining **Wave Surfing** and
movement flattening to a science. He took over RoboWiki management in 2007 and wrote many of the community's definitive
strategy guides.

### Albert Perez

[RoboWiki User Page](https://robowiki.net/wiki/User:Albert)  
Creator of the original **[RoboRumble](https://robowiki.net/wiki/RoboRumble)** client. This distributed ranking system 
transformed Robocode into a true competitive sport by providing a massive, live testing ground for every bot created. 
Albert also pioneered **Precise Prediction**—writing code that perfectly simulated Robocode's physics (acceleration, 
velocity, wall-bouncing) so bots could "re-run" the turn in their heads before moving. This was a critical part for
making GuessFactor Targeting effective.

### Kawigi

[RoboWiki User Page](https://robowiki.net/wiki/User:Kawigi)  
The community's "Great Educator." Kawigi wrote the definitive **GuessFactor Targeting Tutorial** and authored
**FloodMini**, the first successful open-source implementation of GuessFactors, which allowed the wider community to
adopt the technique.

## Bot Innovators

### ABC

[RoboWiki User Page](https://robowiki.net/wiki/User:Abc)  
Inventor of **[Wave Surfing](https://robowiki.net/wiki/Wave_Surfing)**, the most significant defensive discovery in
Robocode history. Before ABC, bots used "Anti-Gravity" or "Random" movement. ABC realized that if the enemy is using 
GuessFactors (waves), the player should "surf" those same waves to find the position the enemy is least likely to fire 
at. He also pioneered **[Dynamic Clustering](https://robowiki.net/wiki/Dynamic_Clustering)** (later perfected by 
Skilgannon), moving away from fixed "bins" toward a "nearest neighbor" search. Along with **Aelryen**, ABC pioneered 
**[Minimum Risk Movement](https://robowiki.net/wiki/Minimum_Risk_Movement)** for melee combat. Author of 
**[Shadow](https://robowiki.net/wiki/Shadow)**, which introduced sophisticated melee gun techniques and multi-target 
engagement.

### Simonton

[RoboWiki User Page](https://robowiki.net/wiki/User:Simonton)  
Author of **[Diamond](https://robowiki.net/wiki/Diamond)**. Simonton pushed **Dynamic Clustering** to its limits,
proving that highly segmented statistical data could achieve near-perfect accuracy against diverse opponents.

### Rednaxela

[RoboWiki User Page](https://robowiki.net/wiki/User:Rednaxela)  
Introduced the use of **[K-D Trees](https://robowiki.net/wiki/K-D_Tree)** to Robocode. This optimization allowed bots to
search massive amounts of historical data instantly, making advanced clustering algorithms computationally viable for
real-time play.

### MultiplyByZer0

[RoboWiki User Page](https://robowiki.net/wiki/User:MultiplyByZer0)

Active wiki editor who documented targeting strategies, wave mechanics, and provided many code samples. Helped
maintain and expand RoboWiki's coverage of intermediate and advanced topics.

---

## The Creator

### Mathew A. Nelson (Mat Nelson)

The original creator of Robocode at IBM in 2001. His vision of "learning through battle" started the entire phenomenon.

### Flemming N. Larsen (fnl)

[RoboWiki User Page](https://robowiki.net/wiki/User:Fnl)  
The long-time maintainer of the classic Robocode project and the creator of **Robocode Tank Royale**. Flemming has kept
the game alive and evolving for over two decades.

---

> [!TIP] Standing on shoulders
> "If I have seen further, it is by standing on the shoulders of giants."
> — Isaac Newton  
> Every bot today is built upon the open-source legacy of these individuals.