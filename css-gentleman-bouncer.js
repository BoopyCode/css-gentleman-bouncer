#!/usr/bin/env node

/**
 * CSS Gentleman Bouncer
 * The bouncer at the velvet rope of your stylesheet
 * "Sorry mate, your specificity isn't high enough for this club"
 */

const fs = require('fs');
const path = require('path');

/**
 * Finds CSS classes that are throwing elbows in the club
 * (aka conflicting declarations with same specificity)
 */
function findCssBrawls(cssContent) {
    const classRegex = /\.([a-zA-Z0-9_-]+)\s*{[^}]*}/g;
    const conflicts = new Map();
    
    let match;
    while ((match = classRegex.exec(cssContent)) !== null) {
        const className = match[1];
        const declaration = match[0];
        
        if (conflicts.has(className)) {
            conflicts.get(className).push(declaration);
        } else {
            conflicts.set(className, [declaration]);
        }
    }
    
    // Filter to only troublemakers (multiple declarations)
    const brawlers = [];
    for (const [className, declarations] of conflicts) {
        if (declarations.length > 1) {
            brawlers.push({
                className,
                declarations,
                count: declarations.length
            });
        }
    }
    
    return brawlers;
}

/**
 * Main function - the bouncer's shift starts here
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('\n🎩 CSS Gentleman Bouncer 🎩');
        console.log('Usage: node css-gentleman-bouncer.js <css-file>');
        console.log('\nI check who\'s causing trouble in your stylesheet club.\n');
        return;
    }
    
    const cssFile = args[0];
    
    try {
        const cssContent = fs.readFileSync(cssFile, 'utf8');
        const brawlers = findCssBrawls(cssContent);
        
        if (brawlers.length === 0) {
            console.log('\n✅ All clear! Your CSS classes are behaving like proper gentlemen.');
            console.log('No duplicate class declarations found.\n');
            return;
        }
        
        console.log(`\n🚨 CSS BRAWL DETECTED in ${cssFile}`);
        console.log('The following classes need to be escorted out:\n');
        
        brawlers.forEach((brawler, index) => {
            console.log(`${index + 1}. .${brawler.className} (${brawler.count} declarations)`);
            brawler.declarations.forEach((decl, i) => {
                console.log(`   ${i + 1}. ${decl.substring(0, 80)}${decl.length > 80 ? '...' : ''}`);
            });
            console.log('');
        });
        
        console.log(`🎩 Found ${brawlers.length} class(es) causing trouble.`);
        console.log('Tip: These gentlemen need to learn to share the dance floor.\n');
        
    } catch (error) {
        console.error(`\n❌ Oops! The bouncer tripped: ${error.message}\n`);
    }
}

// Let the bouncer work his magic
if (require.main === module) {
    main();
}
