const { useState, useRef, useEffect } = React;

        // ==================== CONFIG ====================
        const CONFIG = {
            firebase: {
                apiKey: "AIzaSyDTXi2RdJDFEYO09kolhmFweonyoYZhhPo",
                authDomain: "tech-translator-eb6f4.firebaseapp.com",
                projectId: "tech-translator-eb6f4",
                storageBucket: "tech-translator-eb6f4.firebasestorage.app",
                messagingSenderId: "678412705185",
                appId: "1:678412705185:web:ebe3197af3115067e13fe0",
                measurementId: "G-PLW7CWM1KT"
            },
            appId: 'tech-translator-eb6f4',
            geminiKey: "AIzaSyD6JI10QCioQljUAYC__po77BBvB4niReA",
            claimsCollection: 'sharedWarrantyClaimHistory'
        };

        // ==================== ICONS ====================
        const Icon = ({ children, className }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
        );
        const Icons = {
            Upload: (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></Icon>,
            FileText: (p) => <Icon {...p}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></Icon>,
            Clock: (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>,
            Alert: (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></Icon>,
            ChevronDown: (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>,
            ChevronUp: (p) => <Icon {...p}><path d="m18 15-6-6-6 6"/></Icon>,
            Plus: (p) => <Icon {...p}><path d="M5 12h14"/><path d="M12 5v14"/></Icon>,
            Trash: (p) => <Icon {...p}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Icon>,
            Copy: (p) => <Icon {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>,
            Sparkles: (p) => <Icon {...p}><path d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z"/></Icon>,
            Book: (p) => <Icon {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Icon>,
            RotateCcw: (p) => <Icon {...p}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></Icon>,
            Save: (p) => <Icon {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Icon>,
            Car: (p) => <Icon {...p}><path d="M19 5H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/><path d="M8.5 9.5 7 12"/><path d="m15.5 9.5 1.5 2.5"/></Icon>,
            Lightbulb: (p) => <Icon {...p}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></Icon>,
            TrendingUp: (p) => <Icon {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></Icon>,
            Database: (p) => <Icon {...p}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></Icon>
        };

        // ==================== UTILITIES ====================
        const Utils = {
            parsePunchTimes: (text) => {
                const lines = text.trim().split('\n').filter(l => l.trim());
                const punches = [], errors = [];
                lines.forEach((line, idx) => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length >= 7) {
                        const time = parseFloat(parts[3]);
                        if (!isNaN(time)) {
                            punches.push({
                                date: parts[0], start: parts[1], end: parts[2], time,
                                type: parts[4].toUpperCase(), techId: parts[5],
                                repairLine: parts[6].replace(/[^A-Z0-9]/gi, '').toUpperCase(),
                                rawLine: line
                            });
                        } else errors.push({ line: idx + 1, data: line });
                    } else if (parts.length > 0 && parts.some(p => p.length > 0)) {
                        errors.push({ line: idx + 1, data: line });
                    }
                });
                return { punches, parseErrors: errors };
            },

            aggregateByLine: (punches) => {
                const lineData = {};
                punches.forEach(p => {
                    if (!lineData[p.repairLine]) {
                        lineData[p.repairLine] = { totalTime: 0, wTime: 0, dwTime: 0, technicians: {}, punches: [] };
                    }
                    const line = lineData[p.repairLine];
                    line.totalTime += p.time;
                    line.punches.push(p);
                    if (p.type === 'W') line.wTime += p.time;
                    else if (p.type === 'DW') line.dwTime += p.time;
                    if (!line.technicians[p.techId]) {
                        line.technicians[p.techId] = { totalTime: 0, wTime: 0, dwTime: 0, punches: [] };
                    }
                    const tech = line.technicians[p.techId];
                    tech.totalTime += p.time;
                    tech.punches.push(p);
                    if (p.type === 'W') tech.wTime += p.time;
                    else if (p.type === 'DW') tech.dwTime += p.time;
                });
                return lineData;
            },

            parseRoText: (text) => {
                const roNumber = text.match(/RO Number:\s*(\d+)/i)?.[1]?.trim() || 'N/A';
                const customer = text.match(/Customer:\s*(.+?)(?=\s+Click|$)/i)?.[1]?.trim() || 'N/A';
                const vehicleMatch = text.match(/Vehicle:\s*([A-Z0-9]{17})\s+(\d{4})\s+([^\s\n]+)/i);
                const vin = vehicleMatch?.[1]?.trim() || 'N/A';
                const year = vehicleMatch?.[2]?.trim() || 'N/A';
                const model = vehicleMatch?.[3]?.trim() || 'N/A';
                const yearModel = (year !== 'N/A' && model !== 'N/A') ? `${year} ${model}` : 'N/A';
                const mileage = text.match(/Mileage:\s*([\d,]+)/i)?.[1]?.trim() || 'N/A';
                const advisor = text.match(/Service advisor:\s*(\d+)/i)?.[1]?.trim() || 'N/A';
                const promisedDate = text.match(/Promised date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i)?.[1]?.trim() || 'N/A';
                const tagNumber = text.match(/Tag number:\s*([^\s\n]+)/i)?.[1]?.trim() || 'N/A';

                const details = { roNumber, customer, vin, yearModel, mileage, advisor, promisedDate, tagNumber };
                const lines = {};
                const sections = text.split(/~{5,}/);
                let currentLine = null;

                const shouldFilterLine = (line) => {
                    if (line.match(/^(Repair Order Detail|RO Number:|RO Status:|Customer:|Phone\(s\):|Vehicle:|Mileage:|Payment type:|Service advisor:|Tag number:|Promised|Waiter:|Click to View)/i)) return true;
                    const partPattern = /^([A-Z0-9]{3,4}-[A-Z0-9]{3}-[A-Z0-9]{2}-[A-Z0-9-]*|[\d-]{3,})\s+(\d+)\s+(.+?)\s+([\d,.]+)$/;
                    const laborPattern = /^(\d{2,6}|[A-Z]{2,10})\s+(W|DW|I32C|CT|CM|[A-Z]{1,5})\s+(.+)\s+(\d+(?:\.\d+)?)\s+(\d{1,3}(?:,\d{3})*(?:\.\d+)?)$/;
                    if (partPattern.test(line) || laborPattern.test(line)) return true;
                    if (line.match(/^(Tech\(s\):|Pts:|Story:|Page \d+|Total Line [A-Z]:)/i)) return true;
                    if (line.length >= 2 && line.length <= 30 && line === line.toUpperCase() && /^[A-Z0-9\s\(\),.-]+$/.test(line)) return true;
                    if (line.match(/^(HEAD|SPRING|COLLAR|ELEMENT|SEAL|GASKET|BOLT|NUT|SCREW|WASHER|FILTER|PLUG|SENSOR|VALVE|HOSE|BELT|CLAMP|BRACKET|COVER|CAP|RING|PIN|CLIP|BUSHING|BEARING|SHAFT|GEAR|PULLEY|ROTOR|PAD|SHOE|DRUM|CALIPER|LINE|TUBE|PIPE|FITTING|CONNECTOR|SWITCH|RELAY|FUSE|WIRE|CABLE|HARNESS|MODULE|UNIT|ASSEMBLY|KIT|PACKAGE|SET|REPL\.|REPLACE|REMOVE|INSTALL|DURING REPAIR|WHEN WORKING|IF REQ\.|ACCESS|EXPOSED|FINDINGS|LEAKS|FOR \d|ON-BOARD|ELECTRICAL SYSTEM|GROUND LINE)\b/i)) return true;
                    return false;
                };

                sections.forEach(section => {
                    const trimmed = section.trim();
                    if (trimmed.length < 50 && !trimmed.startsWith('Page ')) return;
                    const sectionLines = trimmed.split('\n').map(l => l.trim()).filter(l => l);
                    if (sectionLines.length === 0) return;

                    const firstLineMatch = sectionLines[0].match(/^([A-Z])[\s*]+(.+)$/);
                    if (!firstLineMatch && currentLine && lines[currentLine]) {
                        const techLineIdx = sectionLines.findIndex(l => l.startsWith('Tech(s):'));
                        const ptsLineIdx = sectionLines.findIndex(l => l.startsWith('Pts:'));
                        const storyIdx = sectionLines.findIndex(l => l.match(/^Story:\s*/i));
                        
                        if (ptsLineIdx >= 0) {
                            const partPattern = /^([A-Z0-9]{3,4}-[A-Z0-9]{3}-[A-Z0-9]{2}-[A-Z0-9-]*|[\d-]{3,})\s+(\d+)\s+(.+?)\s+([\d,.]+)$/;
                            const startIdx = techLineIdx >= 0 ? techLineIdx + 1 : 0;
                            for (let i = startIdx; i < ptsLineIdx; i++) {
                                const line = sectionLines[i];
                                const match = line.match(partPattern);
                                if (match) {
                                    let partDesc = match[3].trim();
                                    let j = i + 1;
                                    while (j < ptsLineIdx && !sectionLines[j].match(partPattern) && sectionLines[j].length < 60) {
                                        partDesc += ' ' + sectionLines[j];
                                        i = j++;
                                    }
                                    if (!lines[currentLine].parts) lines[currentLine].parts = [];
                                    lines[currentLine].parts.push({ partNumber: match[1], quantity: parseInt(match[2], 10), description: partDesc, price: match[4] });
                                }
                            }
                        }
                        
                        if (storyIdx >= 0) {
                            const beforeStoryLines = sectionLines.slice(0, storyIdx).filter(l => !shouldFilterLine(l));
                            if (beforeStoryLines.length > 0 && (!lines[currentLine].story || lines[currentLine].story === 'No story available')) {
                                lines[currentLine].description += ' ' + beforeStoryLines.join(' ');
                            }
                            let story = sectionLines[storyIdx].replace(/^Story:\s*/i, '').trim();
                            const storyContentLines = [];
                            for (let i = storyIdx + 1; i < sectionLines.length; i++) {
                                const line = sectionLines[i];
                                if (line.match(/^Page \d+, Created:/i)) break;
                                storyContentLines.push(line);
                            }
                            if (storyContentLines.length > 0) story += ' ' + storyContentLines.join(' ');
                            if (!lines[currentLine].story || lines[currentLine].story === 'No story available') {
                                lines[currentLine].story = story.trim();
                            } else {
                                lines[currentLine].story += ' ' + story.trim();
                            }
                        } else {
                            const continuationLines = sectionLines.filter(l => !shouldFilterLine(l));
                            const continuationText = continuationLines.join(' ');
                            if (continuationText) {
                                if (!lines[currentLine].story || lines[currentLine].story === 'No story available') {
                                    lines[currentLine].description += ' ' + continuationText;
                                } else {
                                    lines[currentLine].story += ' ' + continuationText;
                                }
                            }
                        }
                        return;
                    }
                    if (!firstLineMatch) return;

                    const lineLetter = firstLineMatch[1];
                    currentLine = lineLetter;
                    let description = firstLineMatch[2].trim();

                    const partPattern = /^([A-Z0-9]{3,4}-[A-Z0-9]{3}-[A-Z0-9]{2}-[A-Z0-9-]*|[\d-]{3,})\s+(\d+)\s+(.+?)\s+([\d,.]+)$/;
                    const laborPattern = /^(\d{2,6}|[A-Z]{2,10})\s+(W|DW|I32C|CT|CM|[A-Z]{1,5})\s+(.+)\s+(\d+(?:\.\d+)?)\s+(\d{1,3}(?:,\d{3})*(?:\.\d+)?)$/;

                    let descEndIdx = 1;
                    while (descEndIdx < sectionLines.length) {
                        const line = sectionLines[descEndIdx];
                        if (partPattern.test(line) || laborPattern.test(line) || line.startsWith('Tech(s):') || line.startsWith('Pts:') || line.startsWith('Story:')) break;
                        description += ' ' + line;
                        descEndIdx++;
                    }

                    const lineTotal = trimmed.match(/Total Line [A-Z]:\s*([\d,]+\.\d{2})/i)?.[1] || 'N/A';
                    const techLineIdx = sectionLines.findIndex(l => l.startsWith('Tech(s):'));
                    const ptsLineIdx = sectionLines.findIndex(l => l.startsWith('Pts:'));
                    const storyLineIdx = sectionLines.findIndex(l => l.startsWith('Story:'));

                    const laborOps = [];
                    const laborEndIdx = techLineIdx > 0 ? techLineIdx : sectionLines.length;
                    for (let i = descEndIdx; i < laborEndIdx; i++) {
                        const line = sectionLines[i];
                        const match = line.match(laborPattern);
                        if (match) {
                            let fullDesc = match[3].trim();
                            let j = i + 1;
                            while (j < laborEndIdx && !sectionLines[j].match(laborPattern) && !sectionLines[j].startsWith('Tech(s):')) {
                                fullDesc += ' ' + sectionLines[j];
                                i = j++;
                            }
                            laborOps.push({ opCode: match[1], laborType: match[2], description: fullDesc, hours: match[4], amount: match[5] });
                        }
                    }

                    const parts = [];
                    if (techLineIdx > 0) {
                        const partsEndIdx = ptsLineIdx > techLineIdx ? ptsLineIdx : (storyLineIdx > techLineIdx ? storyLineIdx : sectionLines.length);
                        for (let i = techLineIdx + 1; i < partsEndIdx; i++) {
                            const line = sectionLines[i];
                            const match = line.match(partPattern);
                            if (match) {
                                let partDesc = match[3].trim();
                                let j = i + 1;
                                while (j < partsEndIdx && !sectionLines[j].match(partPattern) && sectionLines[j].length < 60) {
                                    partDesc += ' ' + sectionLines[j];
                                    i = j++;
                                }
                                parts.push({ partNumber: match[1], quantity: parseInt(match[2], 10), description: partDesc, price: match[4] });
                            }
                        }
                    }

                    let story = 'No story available';
                    if (storyLineIdx > 0) {
                        story = sectionLines[storyLineIdx].replace(/^Story:\s*/i, '').trim();
                        if (storyLineIdx + 1 < sectionLines.length) {
                            const storyLines = [];
                            for (let i = storyLineIdx + 1; i < sectionLines.length; i++) {
                                const line = sectionLines[i];
                                if (line.match(/^Page \d+, Created:/i)) break;
                                storyLines.push(line);
                            }
                            const remaining = storyLines.join(' ').trim();
                            if (remaining) story = story ? story + ' ' + remaining : remaining;
                        }
                    }
                    
                    const laborTypes = laborOps.length > 0 ? [...new Set(laborOps.map(op => op.laborType))].join(', ') : 'N/A';
                    lines[lineLetter] = { description, laborType: laborTypes, story, parts, laborOps, lineTotal };
                });

                return { ...details, lines };
            },

            parseVmiText: (text) => {
                const vmiVin = text.match(/VIN\s*:?\s*([A-Z0-9]{17})/i)?.[1];
                if (!vmiVin) return null;
                const warrantyStart = text.match(/Warranty\s+Start\s*:?\s*(\d{2}\/\d{2}\/\d{4})/i)?.[1] || 'N/A';
                const modelYearMatch = text.match(/Model\s*\/?\s*Year\s*:?\s*(.*?)\s*(\d{4})/i);
                const modelYear = modelYearMatch ? `${modelYearMatch[1].trim()} ${modelYearMatch[2].trim()}` : 'N/A';
                const engineNo = text.match(/Engine\s+No\s*:?\s*(\d+)/i)?.[1] || 'N/A';
                
                const lines = text.split('\n');
                const campaigns = [], servicePackages = [], optionCodes = [], damageHistory = [], customerPayData = [];
                let section = null;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    const lower = line.toLowerCase();
                    if (lower.includes('campaign') && (lower.includes('action') || lower.includes('c1'))) { section = 'campaigns'; continue; }
                    if (lower.includes('service') && lower.includes('package')) { section = 'servicePackages'; continue; }
                    if (lower.includes('option') && lower.includes('code')) { section = 'optionCodes'; continue; }
                    if (lower.includes('damage') && lower.includes('history')) { section = 'damageHistory'; continue; }
                    if (lower.includes('customer') && lower.includes('pay')) { section = 'customerPay'; continue; }
                    if (!section) continue;
                    if (line.length === 0) { section = null; continue; }

                    if (section === 'campaigns' && line.match(/^[A-Z0-9]{10}/)) {
                        const parts = line.split(/\s{2,}/);
                        if (parts.length >= 2) campaigns.push({ code: parts[0], description: parts.slice(1).join(' ') });
                    }
                    if (section === 'servicePackages' && line.match(/^\d+\s/)) servicePackages.push(line);
                    if (section === 'optionCodes' && line.match(/^[A-Z0-9]{3}\s/)) optionCodes.push(line);
                    if (section === 'damageHistory' && line.match(/^\d{2}\/\d{2}\/\d{4}/)) {
                        const parts = line.split(/\s{2,}/);
                        if (parts.length >= 5) {
                            damageHistory.push({ date: parts[0], damageCode: parts[1], dealer: parts[2], ro: parts[3], description: parts.slice(4).join(' ') });
                        } else if (parts.length >= 3) {
                            damageHistory.push({ date: parts[0], damageCode: parts[1], dealer: 'N/A', ro: 'N/A', description: parts.slice(2).join(' ') });
                        }
                    }
                    if (section === 'customerPay' && line.match(/^\d{2}\/\d{2}\/\d{4}/)) {
                        const parts = line.split(/\s{2,}/);
                        if (parts.length >= 3) customerPayData.push({ date: parts[0], roNumber: parts[1], description: parts.slice(2).join(' ') });
                    }
                }
                
                return { vin: vmiVin, warrantyStart, modelYear, engineNo, campaigns, servicePackages, optionCodes, damageHistory, customerPayData };
            },

            parseXotXml: (xmlText) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                const orderItems = xmlDoc.getElementsByTagName('order_item');
                const operations = [];
                
                for (let i = 0; i < orderItems.length; i++) {
                    const item = orderItems[i];
                    const designGroup = item.getElementsByTagName('design_group')[0]?.textContent?.trim() || '';
                    const operationNo = item.getElementsByTagName('operation_no')[0]?.textContent?.trim() || '';
                    const opCode = designGroup && operationNo ? `${designGroup}${operationNo}` : '';
                    
                    const timeElement = item.getElementsByTagName('operation_time')[0];
                    let timeText = timeElement?.textContent?.trim() || '';
                    let hours = 0;
                    if (timeText && timeText !== 'ZM') {
                        const timeNum = parseInt(timeText, 10);
                        hours = timeNum / 10;
                    }

                    const searchCriteria = item.getElementsByTagName('search_criteria')[0]?.textContent?.trim() || '';
                    const activityText = item.getElementsByTagName('activity_text')[0]?.textContent?.trim() || '';
                    const description = `${searchCriteria} ${activityText}`.trim();
                    
                    const damageCodeElement = item.getElementsByTagName('damage_code')[0];
                    let damageCode = null, damageCodeDescription = null, fullDamageString = null;
                    if (damageCodeElement) {
                        const part = damageCodeElement.getAttribute('part') || '';
                        const type = damageCodeElement.getAttribute('type') || '';
                        const repair_type = damageCodeElement.getAttribute('repair_type') || '';
                        damageCode = `${part}${type}${repair_type}`;
                        
                        const partText = damageCodeElement.getElementsByTagName('part_text')[0]?.textContent?.trim() || '';
                        const typeText = damageCodeElement.getElementsByTagName('type_text')[0]?.textContent?.trim() || '';
                        const repairTypeText = damageCodeElement.getElementsByTagName('repair_type_text')[0]?.textContent?.trim() || '';
                        damageCodeDescription = [partText, typeText, repairTypeText].filter(Boolean).join(' ');
                        fullDamageString = `${damageCode} ${damageCodeDescription}`.trim();
                    }

                    operations.push({ opCode, hours, description, damageCode, damageCodeDescription, fullDamageString, category: 'diagnostic', selected: true });
                }
                return operations;
            },

            copyToClipboard: (text, label, setError) => {
                const el = document.createElement('textarea');
                el.value = text;
                el.style.position = 'fixed';
                el.style.top = '0';
                el.style.left = '0';
                document.body.appendChild(el);
                el.select();
                try {
                    const ok = document.execCommand('copy');
                    if (ok) {
                        setError(`�œ“ ${label} copied!`);
                        setTimeout(() => setError(''), 2000);
                    } else setError(`Failed to copy ${label}`);
                } catch (err) {
                    setError(`Error copying ${label}`);
                }
                document.body.removeChild(el);
            },

            fetchWithBackoff: async (url, options, retries = 3, delay = 1000) => {
                try {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        if (response.status >= 400 && response.status < 500) throw new Error(`Client error: ${response.status}`);
                        throw new Error(`Server error: ${response.status}`);
                    }
                    return response.json();
                } catch (err) {
                    if (retries > 0) {
                        await new Promise(res => setTimeout(res, delay));
                        return Utils.fetchWithBackoff(url, options, retries - 1, delay * 2);
                    } else throw err;
                }
            }
        };

        // ==================== HOOKS ====================
        const useFirebase = () => {
            const [db, setDb] = useState(null);
            const [auth, setAuth] = useState(null);
            const [userId, setUserId] = useState(null);
            const [isAuthReady, setIsAuthReady] = useState(false);
            const [error, setError] = useState('');
            const [user, setUser] = useState(null);

            useEffect(() => {
                try {
                    const app = firebase.initializeApp(CONFIG.firebase);
                    const authInstance = firebase.auth(app);
                    const dbInstance = firebase.firestore(app);
                    firebase.firestore.setLogLevel('error');
                    
                    authInstance.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                    
                    setDb(dbInstance);
                    setAuth(authInstance);

                    const unsubscribe = authInstance.onAuthStateChanged((user) => {
                        if (user) {
                            console.log('User authenticated:', user.email, user.uid);
                            setUserId(user.uid);
                            setUser(user);
                        } else {
                            setUserId(null);
                            setUser(null);
                        }
                        setIsAuthReady(true);
                    });

                    return () => unsubscribe();
                } catch (e) {
                    console.error('Firebase Init Error:', e);
                    setError("Failed to initialize.");
                    setIsAuthReady(true);
                }
            }, []);

            const signInWithGoogle = async () => {
                try {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    await auth.signInWithPopup(provider);
                } catch (err) {
                    console.error('Sign in error:', err);
                    setError('Sign in failed.');
                }
            };

            const signOut = async () => {
                try {
                    await auth.signOut();
                } catch (err) {
                    console.error('Sign out error:', err);
                }
            };

            return { db, auth, userId, user, isAuthReady, error, signInWithGoogle, signOut };
        };

        const usePdfParser = () => {
            const parsePdf = async (file) => {
                if (!window.pdfjsLib) throw new Error("PDF library not loaded");
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
                let fullText = '';
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const items = textContent.items.sort((a, b) => {
                        const yDiff = Math.abs(a.transform[5] - b.transform[5]);
                        if (yDiff > 5) return b.transform[5] - a.transform[5];
                        return a.transform[4] - b.transform[4];
                    });
                    
                    let currentY = null;
                    let line = '';
                    items.forEach(item => {
                        const y = item.transform[5];
                        if (currentY !== null && Math.abs(currentY - y) > 5) {
                            fullText += line.trim() + '\n';
                            line = '';
                        }
                        line += item.str + ' ';
                        currentY = y;
                    });
                    if (line.trim()) fullText += line.trim() + '\n';
                    fullText += '\n';
                }
                return fullText;
            };

            return { parsePdf };
        };

        const useAiTranslation = (db, userId, isAuthReady) => {
            const [isTranslating, setIsTranslating] = useState({});
            const [isLearning, setIsLearning] = useState({});

            const translateStory = async (line, originalStory, setError) => {
                if (!isAuthReady || !db || !userId) {
                    setError("Application not ready.");
                    return null;
                }
                if (!originalStory || originalStory === 'No story available') {
                    setError(`Line ${line} has no story.`);
                    return null;
                }
                
                setIsTranslating(prev => ({ ...prev, [line]: true }));
                setError('');

                try {
                    const acronymsPath = `artifacts/${CONFIG.appId}/users/${userId}/customAcronyms`;
                    const acronymsSnapshot = await db.collection(acronymsPath).get();
                    const customAcronyms = acronymsSnapshot.docs.map(doc => doc.data());
                    let customAcronymsString = "No custom acronyms provided.";
                    if (customAcronyms.length > 0) {
                        customAcronymsString = customAcronyms.map(a => `${a.acronym}: ${a.definition}`).join('\n');
                    }
                    
                    const prefsPath = `artifacts/${CONFIG.appId}/users/${userId}/customPreferences`;
                    const prefsSnapshot = await db.collection(prefsPath).get();
                    const customPreferences = prefsSnapshot.docs.map(doc => doc.data());
                    let customPreferencesString = "No custom preferences provided.";
                    if (customPreferences.length > 0) {
                        customPreferencesString = customPreferences.map(p => `- ${p.preference}`).join('\n');
                    }

                    const systemPrompt = `You are an expert technical writer for Mercedes-Benz. Translate technical repair notes into factual, concise, clear plain English.

RULES:
1. Be extremely concise.
2. Be 100% factual and direct.
3. DO NOT use "we found", "your vehicle", "to address your concern", "we noted".
4. Translate all acronyms.
5. Start directly with the first action or finding.
6. End with "Service complete." or "Vehicle now operating per specification."

Custom acronyms:
${customAcronymsString}

Custom preferences:
${customPreferencesString}

If unsure about an acronym, place it in [brackets].

Translate this technician note.`;
                    
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${CONFIG.geminiKey}`;
                    const payload = {
                        contents: [{ parts: [{ text: originalStory }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] }
                    };

                    const result = await Utils.fetchWithBackoff(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        setError(`�œ“ Line ${line} translated!`);
                        setTimeout(() => setError(''), 3000);
                        return text;
                    } else throw new Error("Invalid response from API.");
                } catch (err) {
                    setError(`Failed to translate Line ${line}. ${err.message}`);
                    return null;
                } finally {
                    setIsTranslating(prev => ({ ...prev, [line]: false }));
                }
            };

            const learnFromEdit = async (line, edited, original, setError, fetchDatabaseData) => {
                if (!edited || !original || edited === original) {
                    setError("No changes to learn from.");
                    return;
                }
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return;
                }

                setIsLearning(prev => ({ ...prev, [line]: true }));
                setError(`Analyzing edits for Line ${line}...`);

                try {
                    const systemPrompt = `You are a linguistic analyst. Compare original and edited text. Identify new acronyms defined or wording preferences.
Original: ${original}
Edited: ${edited}
Respond in JSON: {"acronyms": [{"acronym": "XYZ", "definition": "Explain"}], "preferences": ["Use X instead of Y"]}
If none found, return {"acronyms": [], "preferences": []}`;

                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${CONFIG.geminiKey}`;
                    const payload = {
                        contents: [{ parts: [{ text: `Original: ${original}\nEdited: ${edited}` }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: { responseMimeType: "application/json" }
                    };

                    const result = await Utils.fetchWithBackoff(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (!jsonText) throw new Error("Invalid response.");
                    const learnings = JSON.parse(jsonText);
                    let addedAcr = 0, addedPref = 0;

                    if (learnings.acronyms && learnings.acronyms.length > 0) {
                        const acrCollection = db.collection(`artifacts/${CONFIG.appId}/users/${userId}/customAcronyms`);
                        for (const acr of learnings.acronyms) {
                            const existing = await acrCollection.where("acronym", "==", acr.acronym).get();
                            if (existing.empty && acr.acronym && acr.definition) {
                                await acrCollection.add(acr);
                                addedAcr++;
                            }
                        }
                    }

                    if (learnings.preferences && learnings.preferences.length > 0) {
                        const prefCollection = db.collection(`artifacts/${CONFIG.appId}/users/${userId}/customPreferences`);
                        for (const pref of learnings.preferences) {
                            const existing = await prefCollection.where("preference", "==", pref).get();
                            if (existing.empty && pref) {
                                await prefCollection.add({ preference: pref });
                                addedPref++;
                            }
                        }
                    }

                    if (addedAcr > 0 || addedPref > 0) {
                        setError(`�œ“ Added ${addedAcr} acronym(s) and ${addedPref} preference(s).`);
                        fetchDatabaseData();
                    } else setError("No new rules found.");
                    setTimeout(() => setError(''), 4000);
                } catch (err) {
                    setError(`Failed to learn: ${err.message}`);
                } finally {
                    setIsLearning(prev => ({ ...prev, [line]: false }));
                }
            };

            return { translateStory, learnFromEdit, isTranslating, isLearning };
        };

        // ==================== MAIN APP ====================
        // ==================== MAIN APP ====================
        const App = () => {
            const { db, userId, user, isAuthReady, error: fbError, signInWithGoogle, signOut } = useFirebase();
            const { parsePdf } = usePdfParser();
            const [error, setError] = useState('');
            const [punchData, setPunchData] = useState('');
            const [vmiPdfFile, setVmiPdfFile] = useState(null);
            const [roPdfFile, setRoPdfFile] = useState(null);
            const [manualRoText, setManualRoText] = useState('');
            const [parsedData, setParsedData] = useState(null);
            const [roDetails, setRoDetails] = useState(null);
            const [vmiData, setVmiData] = useState(null);
            const [expandedLines, setExpandedLines] = useState(new Set());
            const [showInputSection, setShowInputSection] = useState(true);
            const [activeTab, setActiveTab] = useState('all');
            const [isAnalyzing, setIsAnalyzing] = useState(false);
            const [warrantyData, setWarrantyData] = useState({});
            const [manualWarrantyLines, setManualWarrantyLines] = useState(new Set());
            const [showWarrantyConfirmDialog, setShowWarrantyConfirmDialog] = useState(false);
            const [pendingWarrantyToggle, setPendingWarrantyToggle] = useState(null);
            const [editedStories, setEditedStories] = useState({});
            const [originalStories, setOriginalStories] = useState({});
            const [showDatabaseModal, setShowDatabaseModal] = useState(false);
            const [customAcronyms, setCustomAcronyms] = useState([]);
            const [customPreferences, setCustomPreferences] = useState([]);
            const [newAcronym, setNewAcronym] = useState('');
            const [newDefinition, setNewDefinition] = useState('');
            const [newPreference, setNewPreference] = useState('');
            const [isDbLoading, setIsDbLoading] = useState(false);
            const [showImportModal, setShowImportModal] = useState(false);
            const [showXotImportModal, setShowXotImportModal] = useState(false);
            const [xotOperations, setXotOperations] = useState([]);
            const [currentImportLine, setCurrentImportLine] = useState(null);
            const [showMigrationDialog, setShowMigrationDialog] = useState(false);
            const [oldUserId, setOldUserId] = useState('RXOi8Go6ytMT9QXmfE0eYh1bzg93');
            const [isMigrating, setIsMigrating] = useState(false);
            const [claimHistory, setClaimHistory] = useState([]);
            const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
            const [suggestions, setSuggestions] = useState({});
            const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

            const roFileInputRef = useRef(null);
            const vmiFileInputRef = useRef(null);
            const importFileRef = useRef(null);

            const { translateStory, learnFromEdit, isTranslating, isLearning } = useAiTranslation(db, userId, isAuthReady);

            useEffect(() => {
                if (fbError) setError(fbError);
            }, [fbError]);

            const handlePdfUpload = async (e, type) => {
                const file = e.target.files[0];
                if (!file) return;

                if (type === 'vmi' && (!roDetails || !roDetails.vin || roDetails.vin === 'N/A')) {
                    setError("Parse RO first.");
                    return;
                }
                
                if (type === 'ro') {
                    setRoPdfFile(file);
                    setError('Parsing RO PDF...');
                } else {
                    setVmiPdfFile(file);
                    setError('Parsing VMI PDF...');
                }

                try {
                    const fullText = await parsePdf(file);
                    if (type === 'ro') {
                        setManualRoText(fullText);
                        setError('�œ“ RO PDF parsed.');
                        setTimeout(() => setError(''), 3000);
                    } else {
                        const vmi = Utils.parseVmiText(fullText);
                        if (!vmi) {
                            setError("Could not find VIN in VMI.");
                            return;
                        }
                        if (roDetails && roDetails.vin !== 'N/A' && vmi.vin !== roDetails.vin) {
                            setError(`VMI VIN (${vmi.vin}) != RO VIN (${roDetails.vin}).`);
                            return;
                        }
                        setVmiData(vmi);
                        setError(`�œ“ VMI: ${vmi.campaigns.length} campaigns, ${vmi.damageHistory.length} damage`);
                    }
                } catch (err) {
                    setError(`Parse error: ${err.message}`);
                }
            };

            const handleAnalyze = async () => {
                setIsAnalyzing(true);
                setError('');
                await new Promise(r => setTimeout(r, 100));

                if (!punchData.trim()) {
                    setError('Paste punch time data');
                    setIsAnalyzing(false);
                    return;
                }

                if (manualRoText.trim()) {
                    try {
                        const parsed = Utils.parseRoText(manualRoText);
                        setRoDetails(parsed);
                    } catch (err) {
                        setError(`RO parse error: ${err.message}`);
                        setIsAnalyzing(false);
                        return;
                    }
                }

                try {
                    const { punches, parseErrors } = Utils.parsePunchTimes(punchData);
                    if (punches.length === 0) {
                        setError('No valid punch data');
                        setIsAnalyzing(false);
                        return;
                    }
                    const aggregated = Utils.aggregateByLine(punches);
                    setParsedData({ aggregated, parseErrors, totalPunches: punches.length });
                } catch (err) {
                    setError(`Parse error: ${err.message}`);
                }
                setIsAnalyzing(false);
            };

            const clearAll = () => {
                setPunchData('');
                setVmiPdfFile(null);
                setRoPdfFile(null);
                setManualRoText('');
                setParsedData(null);
                setRoDetails(null);
                setVmiData(null);
                setError('');
                setExpandedLines(new Set());
                setActiveTab('all');
                setWarrantyData({});
                setManualWarrantyLines(new Set());
                setShowImportModal(false);
                setEditedStories({});
                setOriginalStories({});
                if (roFileInputRef.current) roFileInputRef.current.value = '';
                if (vmiFileInputRef.current) vmiFileInputRef.current.value = '';
                if (importFileRef.current) importFileRef.current.value = '';
            };

            const isWarrantyLine = (line) => {
                if (manualWarrantyLines.has(line)) return true;
                const lineDetails = roDetails?.lines?.[line];
                return lineDetails?.laborType?.split(',').some(lt => lt.trim().startsWith('W')) || false;
            };

            const toggleLine = (line) => {
                setExpandedLines(prev => {
                    const newSet = new Set(prev);
                    newSet.has(line) ? newSet.delete(line) : newSet.add(line);
                    return newSet;
                });
            };

            const getFilteredLines = () => {
                if (!parsedData?.aggregated) return {};
                if (activeTab === 'warranty') {
                    const filtered = {};
                    Object.entries(parsedData.aggregated).forEach(([line, data]) => {
                        if (isWarrantyLine(line)) filtered[line] = data;
                    });
                    return filtered;
                }
                return parsedData.aggregated;
            };

            const handleStoryChange = (line, newStory) => {
                setEditedStories(prev => ({ ...prev, [line]: newStory }));
            };

            const batchTranslateStories = async () => {
                if (!roDetails || !roDetails.lines) {
                    setError("No RO loaded");
                    return;
                }

                const linesToTranslate = Object.keys(roDetails.lines).filter(line => {
                    const story = roDetails.lines[line].story;
                    return story && story !== 'No story available' && !editedStories[line] && !originalStories[line];
                });

                if (linesToTranslate.length === 0) {
                    setError("All stories translated.");
                    setTimeout(() => setError(''), 3000);
                    return;
                }

                setError(`Translating ${linesToTranslate.length} stories...`);
                setIsAnalyzing(true);

                let successCount = 0;
                for (const line of linesToTranslate) {
                    const story = roDetails.lines[line].story;
                    setOriginalStories(prev => ({ ...prev, [line]: story }));
                    const result = await translateStory(line, story, setError);
                    if (result) {
                        setEditedStories(prev => ({ ...prev, [line]: result }));
                        successCount++;
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                setIsAnalyzing(false);
                setError(`�œ“ ${successCount}/${linesToTranslate.length} translated`);
                setTimeout(() => setError(''), 5000);
            };

            const undoTranslation = (line) => {
                if (originalStories[line]) {
                    setEditedStories(prev => {
                        const newStories = { ...prev };
                        delete newStories[line];
                        return newStories;
                    });
                    setError(`�œ“ Line ${line} restored`);
                    setTimeout(() => setError(''), 2000);
                }
            };

            const handleWarrantyToggle = (line) => {
                setPendingWarrantyToggle(line);
                setShowWarrantyConfirmDialog(true);
            };

            const confirmWarrantyToggle = () => {
                const line = pendingWarrantyToggle;
                if (!line) return;
                setManualWarrantyLines(prev => {
                    const newSet = new Set(prev);
                    newSet.has(line) ? newSet.delete(line) : newSet.add(line);
                    return newSet;
                });
                setShowWarrantyConfirmDialog(false);
                setPendingWarrantyToggle(null);
            };

            const initWarrantyLineData = (line) => {
                if (!warrantyData[line]) {
                    setWarrantyData(prev => ({
                        ...prev,
                        [line]: { mainPartIndex: null, damageCode: '', diagnosticOps: [], repairOps: [] }
                    }));
                }
            };

            const updateWarrantyField = (line, field, value) => {
                initWarrantyLineData(line);
                setWarrantyData(prev => ({ ...prev, [line]: { ...prev[line], [field]: value } }));
            };

            const addOpCode = (line, type) => {
                initWarrantyLineData(line);
                const field = type === 'diagnostic' ? 'diagnosticOps' : 'repairOps';
                const lineData = parsedData?.aggregated[line];
                const firstTech = lineData ? Object.keys(lineData.technicians)[0] : '';
                setWarrantyData(prev => ({
                    ...prev,
                    [line]: { ...prev[line], [field]: [...(prev[line]?.[field] || []), { opCode: '', soldHours: '', tech: firstTech, description: '', isZM: false }] }
                }));
            };

            const addPresetDiagnostic = (line, opCode, hours, description = '') => {
                initWarrantyLineData(line);
                const lineData = parsedData?.aggregated[line];
                const firstTech = lineData ? Object.keys(lineData.technicians)[0] : '';
                setWarrantyData(prev => ({
                    ...prev,
                    [line]: {
                        ...prev[line],
                        diagnosticOps: [...(prev[line]?.diagnosticOps || []), { opCode, soldHours: hours.toString(), tech: firstTech, description, isZM: false }]
                    }
                }));
            };

            const updateOpCode = (line, type, index, field, value) => {
                const arrayField = type === 'diagnostic' ? 'diagnosticOps' : 'repairOps';
                setWarrantyData(prev => ({
                    ...prev,
                    [line]: {
                        ...prev[line],
                        [arrayField]: prev[line][arrayField].map((op, i) => i === index ? { ...op, [field]: value } : op)
                    }
                }));
            };

            const removeOpCode = (line, type, index) => {
                const arrayField = type === 'diagnostic' ? 'diagnosticOps' : 'repairOps';
                setWarrantyData(prev => ({
                    ...prev,
                    [line]: { ...prev[line], [arrayField]: prev[line][arrayField].filter((_, i) => i !== index) }
                }));
            };

            const toggleOpType = (line, currentType, index) => {
                const currentArrayField = currentType === 'diagnostic' ? 'diagnosticOps' : 'repairOps';
                const targetArrayField = currentType === 'diagnostic' ? 'repairOps' : 'diagnosticOps';

                setWarrantyData(prev => {
                    const lineData = prev[line];
                    if (!lineData || !lineData[currentArrayField] || !lineData[currentArrayField][index]) return prev;
                    
                    const operation = { ...lineData[currentArrayField][index] };
                    const newCurrentArray = lineData[currentArrayField].filter((_, i) => i !== index);
                    const newTargetArray = [...(lineData[targetArrayField] || []), operation];
                    
                    return {
                        ...prev,
                        [line]: {
                            ...lineData,
                            [currentArrayField]: newCurrentArray,
                            [targetArrayField]: newTargetArray
                        }
                    };
                });
            };

            const getRemainingHours = (line, techId, punchType) => {
                const lineData = parsedData?.aggregated[line];
                if (!lineData?.technicians[techId]) return 0;

                const totalPunched = punchType === 'W' ? lineData.technicians[techId].wTime : lineData.technicians[techId].dwTime;
                const relevantOps = punchType === 'DW' ? (warrantyData[line]?.diagnosticOps || []) : (warrantyData[line]?.repairOps || []);
                const claimedOps = relevantOps.filter(op => op.tech === techId && op.soldHours);
                const totalClaimed = claimedOps.reduce((sum, op) => sum + parseFloat(op.soldHours || 0), 0);
                
                return totalPunched - totalClaimed;
            };

            const handleXotImport = (line) => {
                setCurrentImportLine(line);
                setShowXotImportModal(true);
            };

            const handleXotFileSelect = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    const text = await file.text();
                    const operations = Utils.parseXotXml(text);
                    setXotOperations(operations);
                } catch (err) {
                    setError(`XOT parse error: ${err.message}`);
                }
            };

            const toggleXotOperation = (index) => {
                setXotOperations(prev => prev.map((op, i) => i === index ? { ...op, selected: !op.selected } : op));
            };

            const toggleXotCategory = (index) => {
                setXotOperations(prev => prev.map((op, i) => i === index ? { ...op, category: op.category === 'diagnostic' ? 'repair' : 'diagnostic' } : op));
            };

            const importSelectedXotOps = () => {
                if (!currentImportLine) return;
                const lineData = parsedData?.aggregated[currentImportLine];
                const firstTech = lineData ? Object.keys(lineData.technicians)[0] : '';
                
                const selectedOps = xotOperations.filter(op => op.selected);
                const opWithDamageCode = selectedOps.find(op => op.fullDamageString);
                
                initWarrantyLineData(currentImportLine);

                setWarrantyData(prev => {
                    const existingLineData = prev[currentImportLine] || {};
                    const newDamageCode = opWithDamageCode ? opWithDamageCode.fullDamageString : existingLineData.damageCode;
                    
                    const diagnosticOps = selectedOps.filter(op => op.category === 'diagnostic').map(op => ({ opCode: op.opCode, soldHours: op.hours.toString(), tech: firstTech, description: op.description, isZM: false }));
                    const repairOps = selectedOps.filter(op => op.category === 'repair').map(op => ({ opCode: op.opCode, soldHours: op.hours.toString(), tech: firstTech, description: op.description, isZM: false }));

                    return {
                        ...prev,
                        [currentImportLine]: {
                            ...existingLineData,
                            damageCode: newDamageCode,
                            diagnosticOps: [...(existingLineData.diagnosticOps || []), ...diagnosticOps],
                            repairOps: [...(existingLineData.repairOps || []), ...repairOps]
                        }
                    };
                });

                setShowXotImportModal(false);
                setXotOperations([]);
                setCurrentImportLine(null);
                setError('�œ“ XOT imported!');
                setTimeout(() => setError(''), 3000);
            };

            const saveClaimToHistory = async (line) => {
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return;
                }
                if (!roDetails || !warrantyData[line]) {
                    setError("No claim data to save.");
                    return;
                }

                try {
                    const lineDetails = roDetails.lines[line];
                    const lineWarrantyData = warrantyData[line];
                    const mainPart = lineWarrantyData.mainPartIndex !== null && lineDetails?.parts?.[lineWarrantyData.mainPartIndex] 
                        ? lineDetails.parts[lineWarrantyData.mainPartIndex] 
                        : null;

                    // Extract keywords from description
                    const keywords = lineDetails.description
                        .toLowerCase()
                        .split(/\s+/)
                        .filter(word => word.length > 3)
                        .slice(0, 10);

                    // Extract model and year from roDetails
                    const [year, ...modelParts] = (roDetails.yearModel || '').split(' ');
                    const model = modelParts.join(' ');

                    const claimData = {
                        timestamp: new Date().toISOString(),
                        userId: userId,
                        userEmail: user?.email || 'unknown',
                        lastModifiedBy: user?.email || 'unknown',
                        lastModifiedAt: new Date().toISOString(),
                        roNumber: roDetails.roNumber,
                        vin: roDetails.vin,
                        model: model || 'Unknown',
                        year: year || 'Unknown',
                        mileage: roDetails.mileage,
                        repairLine: line,
                        damageCode: lineWarrantyData.damageCode || '',
                        damageCodeBase: lineWarrantyData.damageCode ? lineWarrantyData.damageCode.substring(0, 8) : '',
                        description: lineDetails.description || '',
                        keywords: keywords,
                        diagnosticOps: (lineWarrantyData.diagnosticOps || []).map(op => ({
                            opCode: op.opCode,
                            soldHours: parseFloat(op.soldHours) || 0,
                            description: op.description || '',
                            isZM: op.isZM || false
                        })),
                        repairOps: (lineWarrantyData.repairOps || []).map(op => ({
                            opCode: op.opCode,
                            soldHours: parseFloat(op.soldHours) || 0,
                            description: op.description || '',
                            isZM: op.isZM || false
                        })),
                        mainPart: mainPart ? {
                            partNumber: mainPart.partNumber,
                            description: mainPart.description
                        } : null,
                        totalDiagnosticHours: (lineWarrantyData.diagnosticOps || []).reduce((s, op) => s + (parseFloat(op.soldHours) || 0), 0),
                        totalRepairHours: (lineWarrantyData.repairOps || []).reduce((s, op) => s + (parseFloat(op.soldHours) || 0), 0)
                    };

                    // Check for ANY existing claims with same RO and line (across all users)
                    const existingQuery = await db.collection(CONFIG.claimsCollection)
                        .where('roNumber', '==', roDetails.roNumber)
                        .where('repairLine', '==', line)
                        .get();

                    if (!existingQuery.empty) {
                        const docId = existingQuery.docs[0].id;
                        await db.collection(CONFIG.claimsCollection).doc(docId).update(claimData);
                        setError(`�œ“ Claim for Line ${line} updated!`);
                    } else {
                        await db.collection(CONFIG.claimsCollection).add(claimData);
                        setError(`�œ“ Claim for Line ${line} saved!`);
                    }
                    
                    setTimeout(() => setError(''), 3000);
                    await fetchClaimHistory();
                } catch (err) {
                    console.error('Error saving claim:', err);
                    setError(`Failed to save claim: ${err.message}`);
                }
            };

            const fetchClaimHistory = async () => {
                if (!isAuthReady || !db) return;
                
                try {
                    const snapshot = await db.collection(CONFIG.claimsCollection)
                        .orderBy('timestamp', 'desc')
                        .limit(500)
                        .get();
                    
                    const claims = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setClaimHistory(claims);
                    console.log('Loaded claim history:', claims.length, 'claims');
                } catch (err) {
                    console.error('Error fetching claim history:', err);
                }
            };

            const deleteClaim = async (claimId) => {
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return;
                }
                
                try {
                    await db.collection(CONFIG.claimsCollection).doc(claimId).delete();
                    setError('�œ“ Claim deleted!');
                    setTimeout(() => setError(''), 2000);
                    await fetchClaimHistory();
                } catch (err) {
                    console.error('Error deleting claim:', err);
                    setError(`Failed to delete: ${err.message}`);
                }
            };

            const importClaimsToDatabase = async (sessionData) => {
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return 0;
                }
                if (!sessionData.warrantyData || !sessionData.roDetails) {
                    return 0;
                }

                let importCount = 0;
                try {
                    for (const [line, lineWarrantyData] of Object.entries(sessionData.warrantyData)) {
                        const lineDetails = sessionData.roDetails.lines?.[line];
                        if (!lineDetails || !lineWarrantyData) continue;

                        const mainPart = lineWarrantyData.mainPartIndex !== null && lineDetails?.parts?.[lineWarrantyData.mainPartIndex] 
                            ? lineDetails.parts[lineWarrantyData.mainPartIndex] 
                            : null;

                        const keywords = lineDetails.description
                            .toLowerCase()
                            .split(/\s+/)
                            .filter(word => word.length > 3)
                            .slice(0, 10);

                        const [year, ...modelParts] = (sessionData.roDetails.yearModel || '').split(' ');
                        const model = modelParts.join(' ');

                        const claimData = {
                            timestamp: sessionData.savedAt || new Date().toISOString(),
                            userId: userId,
                            userEmail: user?.email || 'imported',
                            lastModifiedBy: user?.email || 'imported',
                            lastModifiedAt: new Date().toISOString(),
                            roNumber: sessionData.roDetails.roNumber,
                            vin: sessionData.roDetails.vin,
                            model: model || 'Unknown',
                            year: year || 'Unknown',
                            mileage: sessionData.roDetails.mileage,
                            repairLine: line,
                            damageCode: lineWarrantyData.damageCode || '',
                            damageCodeBase: lineWarrantyData.damageCode ? lineWarrantyData.damageCode.substring(0, 8) : '',
                            description: lineDetails.description || '',
                            keywords: keywords,
                            diagnosticOps: (lineWarrantyData.diagnosticOps || []).map(op => ({
                                opCode: op.opCode,
                                soldHours: parseFloat(op.soldHours) || 0,
                                description: op.description || '',
                                isZM: op.isZM || false
                            })),
                            repairOps: (lineWarrantyData.repairOps || []).map(op => ({
                                opCode: op.opCode,
                                soldHours: parseFloat(op.soldHours) || 0,
                                description: op.description || '',
                                isZM: op.isZM || false
                            })),
                            mainPart: mainPart ? {
                                partNumber: mainPart.partNumber,
                                description: mainPart.description
                            } : null,
                            totalDiagnosticHours: (lineWarrantyData.diagnosticOps || []).reduce((s, op) => s + (parseFloat(op.soldHours) || 0), 0),
                            totalRepairHours: (lineWarrantyData.repairOps || []).reduce((s, op) => s + (parseFloat(op.soldHours) || 0), 0),
                            importedFrom: 'session'
                        };

                        // Check for existing claims (across all users)
                        const existingQuery = await db.collection(CONFIG.claimsCollection)
                            .where('roNumber', '==', sessionData.roDetails.roNumber)
                            .where('repairLine', '==', line)
                            .get();

                        if (!existingQuery.empty) {
                            // Update most recent, delete duplicates
                            const existingClaims = existingQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                            existingClaims.sort((a, b) => {
                                const timeA = new Date(a.lastModifiedAt || a.timestamp || 0).getTime();
                                const timeB = new Date(b.lastModifiedAt || b.timestamp || 0).getTime();
                                return timeB - timeA;
                            });
                            
                            await db.collection(CONFIG.claimsCollection).doc(existingClaims[0].id).update(claimData);
                            
                            // Clean up duplicates
                            for (let i = 1; i < existingClaims.length; i++) {
                                try {
                                    await db.collection(CONFIG.claimsCollection).doc(existingClaims[i].id).delete();
                                } catch (delErr) {
                                    console.error(`Failed to delete duplicate during import:`, delErr);
                                }
                            }
                        } else {
                            await db.collection(CONFIG.claimsCollection).add(claimData);
                        }
                        importCount++;
                    }
                } catch (err) {
                    console.error('Error importing claims:', err);
                    setError(`Import error: ${err.message}`);
                }
                return importCount;
            };

            const getAISuggestions = async (line, damageCode, description) => {
                if (!damageCode && !description) return null;
                
                setIsLoadingSuggestions(true);
                
                try {
                    const damageCodeBase = damageCode ? damageCode.substring(0, 8) : '';
                    const relevantClaims = claimHistory.filter(claim => {
                        if (damageCodeBase && claim.damageCodeBase === damageCodeBase) return true;
                        if (description && claim.description.toLowerCase().includes(description.toLowerCase().substring(0, 20))) return true;
                        return false;
                    }).slice(0, 10);

                    if (relevantClaims.length === 0) {
                        setIsLoadingSuggestions(false);
                        return null;
                    }

                    const currentModel = roDetails?.yearModel ? roDetails.yearModel.split(' ').slice(1).join(' ') : 'Unknown';

                    // Build model-specific operation database
                    const opDatabase = {};
                    relevantClaims.forEach(claim => {
                        [...(claim.diagnosticOps || []), ...(claim.repairOps || [])].forEach(op => {
                            if (!op.opCode) return;
                            const key = `${op.opCode}`;
                            if (!opDatabase[key]) {
                                opDatabase[key] = {
                                    opCode: op.opCode,
                                    description: op.description || '',
                                    byModel: {},
                                    allTimes: [],
                                    zmCount: 0
                                };
                            }
                            const model = claim.model || 'Unknown';
                            if (!opDatabase[key].byModel[model]) {
                                opDatabase[key].byModel[model] = { times: [], zmCount: 0 };
                            }
                            if (op.isZM) {
                                opDatabase[key].zmCount++;
                                opDatabase[key].byModel[model].zmCount++;
                            }
                            opDatabase[key].byModel[model].times.push(op.soldHours);
                            opDatabase[key].allTimes.push(op.soldHours);
                        });
                    });

                    // Prepare context for AI
                    const historicalContext = relevantClaims.map(claim => {
                        const diagOps = (claim.diagnosticOps || []).map(op => 
                            `${op.opCode} (${op.isZM ? 'ZM - ' : ''}${op.soldHours}h)${op.description ? `: ${op.description}` : ''}`
                        ).join(', ');
                        const repairOps = (claim.repairOps || []).map(op => 
                            `${op.opCode} (${op.isZM ? 'ZM - ' : ''}${op.soldHours}h)${op.description ? `: ${op.description}` : ''}`
                        ).join(', ');
                        return `Damage: ${claim.damageCode}\nModel: ${claim.model}\nDiagnostic: ${diagOps}\nRepair: ${repairOps}`;
                    }).join('\n\n');

                    const systemPrompt = `You are an expert Mercedes-Benz warranty advisor. Based on historical claims data, suggest the most likely operation codes and hours for this new claim.

Historical claims with similar damage codes or descriptions:
${historicalContext}

Current claim:
Damage Code: ${damageCode}
Description: ${description}
Model: ${currentModel}

IMPORTANT FORMAT: For each operation, provide:
1. opCode: The operation code
2. opDescription: The actual operation description (e.g., "Basic check engine light diagnosis and fault code read")
3. hours: The labor time (use model-specific average if available, or overall average)
4. isZM: true if this operation has no set time and varies by actual work performed
5. reason: Brief explanation of why this operation is appropriate

Respond with JSON:
{
  "suggestedDiagnostic": [{"opCode": "541011", "opDescription": "Initial diagnostic scan", "hours": 0.2, "isZM": false, "reason": "Standard first step"}],
  "suggestedRepair": [{"opCode": "123456", "opDescription": "Replace component X", "hours": 1.5, "isZM": false, "reason": "Common fix for this damage code"}],
  "confidence": "high/medium/low",
  "notes": "brief explanation"
}

Only suggest operations that appear in the historical data or are standard Mercedes procedures.`;

                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${CONFIG.geminiKey}`;
                    const payload = {
                        contents: [{ parts: [{ text: `Damage Code: ${damageCode}\nDescription: ${description}\nModel: ${currentModel}` }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: { responseMimeType: "application/json" }
                    };

                    const result = await Utils.fetchWithBackoff(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (jsonText) {
                        const aiSuggestions = JSON.parse(jsonText);
                        
                        // Enhance suggestions with database info
                        ['suggestedDiagnostic', 'suggestedRepair'].forEach(type => {
                            if (aiSuggestions[type]) {
                                aiSuggestions[type] = aiSuggestions[type].map(op => {
                                    const dbEntry = opDatabase[op.opCode];
                                    if (dbEntry) {
                                        const modelData = dbEntry.byModel[currentModel];
                                        const isZM = dbEntry.zmCount > 0;
                                        let avgHours = op.hours;
                                        
                                        if (modelData && modelData.times.length > 0) {
                                            avgHours = modelData.times.reduce((a, b) => a + b, 0) / modelData.times.length;
                                        } else if (dbEntry.allTimes.length > 0) {
                                            avgHours = dbEntry.allTimes.reduce((a, b) => a + b, 0) / dbEntry.allTimes.length;
                                        }
                                        
                                        return {
                                            ...op,
                                            hours: parseFloat(avgHours.toFixed(1)),
                                            isZM: isZM || op.isZM,
                                            sampleCount: modelData ? modelData.times.length : dbEntry.allTimes.length
                                        };
                                    }
                                    return op;
                                });
                            }
                        });
                        
                        setSuggestions(prev => ({ ...prev, [line]: { ...aiSuggestions, relevantClaims, opDatabase } }));
                        return aiSuggestions;
                    }
                } catch (err) {
                    console.error('Error getting AI suggestions:', err);
                } finally {
                    setIsLoadingSuggestions(false);
                }
                return null;
            };

            const applySuggestedOperations = (line, suggestions) => {
                if (!suggestions) return;

                const lineData = parsedData?.aggregated[line];
                const firstTech = lineData ? Object.keys(lineData.technicians)[0] : '';

                initWarrantyLineData(line);

                setWarrantyData(prev => {
                    const existingLineData = prev[line] || {};
                    
                    const newDiagnosticOps = (suggestions.suggestedDiagnostic || []).map(op => ({
                        opCode: op.opCode,
                        soldHours: op.hours.toString(),
                        tech: firstTech,
                        description: op.opDescription || op.reason || '',
                        isZM: op.isZM || false
                    }));

                    const newRepairOps = (suggestions.suggestedRepair || []).map(op => ({
                        opCode: op.opCode,
                        soldHours: op.hours.toString(),
                        tech: firstTech,
                        description: op.opDescription || op.reason || '',
                        isZM: op.isZM || false
                    }));

                    return {
                        ...prev,
                        [line]: {
                            ...existingLineData,
                            diagnosticOps: [...(existingLineData.diagnosticOps || []), ...newDiagnosticOps],
                            repairOps: [...(existingLineData.repairOps || []), ...newRepairOps]
                        }
                    };
                });

                setError(`�œ“ Applied ${suggestions.suggestedDiagnostic?.length || 0} diagnostic and ${suggestions.suggestedRepair?.length || 0} repair operations!`);
                setTimeout(() => setError(''), 3000);
            };

            const applySingleOperation = (line, op, type) => {
                const lineData = parsedData?.aggregated[line];
                const firstTech = lineData ? Object.keys(lineData.technicians)[0] : '';

                initWarrantyLineData(line);

                const newOp = {
                    opCode: op.opCode,
                    soldHours: op.hours.toString(),
                    tech: firstTech,
                    description: op.opDescription || op.reason || '',
                    isZM: op.isZM || false
                };

                setWarrantyData(prev => {
                    const existingLineData = prev[line] || {};
                    const field = type === 'diagnostic' ? 'diagnosticOps' : 'repairOps';
                    return {
                        ...prev,
                        [line]: {
                            ...existingLineData,
                            [field]: [...(existingLineData[field] || []), newOp]
                        }
                    };
                });

                setError(`�œ“ Added ${op.opCode} to ${type}!`);
                setTimeout(() => setError(''), 2000);
            };

            // Load claim history when auth is ready
            useEffect(() => {
                if (isAuthReady && db && userId) {
                    fetchClaimHistory();
                }
            }, [isAuthReady, db, userId]);

            const generateExportData = () => {
                const warrantyLines = Object.entries(parsedData?.aggregated || {}).filter(([line]) => isWarrantyLine(line));
                
                return warrantyLines.map(([line, data]) => {
                    const lineDetails = roDetails?.lines?.[line];
                    const lineWarrantyData = warrantyData[line] || {};
                    const mainPart = lineWarrantyData.mainPartIndex !== null && lineDetails?.parts?.[lineWarrantyData.mainPartIndex] ? lineDetails.parts[lineWarrantyData.mainPartIndex] : null;
                    const storyToExport = editedStories[line] !== undefined ? editedStories[line] : (lineDetails?.story || '');

                    return {
                        roNumber: roDetails?.roNumber || 'N/A',
                        vin: roDetails?.vin || 'N/A',
                        customer: roDetails?.customer || 'N/A',
                        yearModel: roDetails?.yearModel || 'N/A',
                        mileage: roDetails?.mileage || 'N/A',
                        repairLine: line,
                        description: lineDetails?.description || '',
                        damageCode: lineWarrantyData.damageCode || '',
                        mainPart,
                        allParts: lineDetails?.parts || [],
                        diagnosticOperations: (lineWarrantyData.diagnosticOps || []).map(op => ({
                            opCode: op.opCode,
                            soldHours: parseFloat(op.soldHours) || 0,
                            techId: op.tech,
                            description: op.description || ''
                        })),
                        repairOperations: (lineWarrantyData.repairOps || []).map(op => ({
                            opCode: op.opCode,
                            soldHours: parseFloat(op.soldHours) || 0,
                            techId: op.tech,
                            description: op.description || ''
                        })),
                        totalDiagnosticHours: (lineWarrantyData.diagnosticOps || []).reduce((s, op) => s + (parseFloat(op.soldHours) || 0), 0),
                        totalRepairHours: (lineWarrantyData.repairOps || []).reduce((s, op) => s + (parseFloat(op.soldHours) || 0), 0),
                        story: storyToExport,
                        technicians: Object.entries(data.technicians).map(([techId, techData]) => ({
                            techId,
                            wTime: techData.wTime,
                            dwTime: techData.dwTime,
                            totalTime: techData.totalTime,
                            wRemaining: getRemainingHours(line, techId, 'W'),
                            dwRemaining: getRemainingHours(line, techId, 'DW')
                        }))
                    };
                });
            };

            const downloadPDF = async () => {
                try {
                    if (!roDetails) {
                        setError("No RO loaded.");
                        return;
                    }
                    const data = generateExportData();
                    const printContent = `<!DOCTYPE html><html><head><title>Warranty Claims Report - RO ${roDetails.roNumber}</title><style>@media print{@page{margin:0.75in}body{margin:0}.print-instructions,.print-button{display:none!important}}body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:8.5in;margin:0 auto;padding:20px}h1{color:#1e40af;border-bottom:3px solid #1e40af;padding-bottom:10px;margin-bottom:20px}.header-info{background:#f1f5f9;padding:15px;border-radius:8px;margin-bottom:30px;border:1px solid #e2e8f0}.header-info p{margin:5px 0;font-size:14px}.claim{margin-bottom:40px;page-break-inside:avoid;border:2px solid #e2e8f0;border-radius:8px;padding:20px}.claim-header{background:#10b981;color:white;padding:10px 15px;margin:-21px -21px 15px -21px;border-radius:6px 6px 0 0;font-size:18px;font-weight:bold}.claim-description{font-size:14px;margin-bottom:15px;color:#475569}.section{margin:15px 0}.section-title{font-weight:bold;color:#1e40af;margin-bottom:8px;font-size:14px;text-transform:uppercase}.operation{background:#f8fafc;padding:8px 12px;margin:5px 0;border-left:3px solid #60a5fa;font-size:13px;border-radius:0 4px 4px 0}.part-item{background:#f8fafc;padding:8px 12px;margin:5px 0;border-left:3px solid #10b981;font-size:13px;border-radius:0 4px 4px 0}.part-main{background:#d1fae5;border-left-color:#059669;font-weight:bold}.tech-punch{background:#f8fafc;padding:8px 12px;margin:5px 0;border-radius:4px;font-size:13px;display:flex;justify-content:space-between;border:1px solid #e2e8f0}.punch-times{display:flex;gap:15px}.punch-time-item{font-size:12px}.punch-w{color:#059669;font-weight:bold}.punch-dw{color:#2563eb;font-weight:bold}.remaining-hours{background:#fef3c7;padding:10px 12px;margin:10px 0;border-left:4px solid #f59e0b;font-size:13px;border-radius:0 4px 4px 0}.total{font-weight:bold;color:#059669;margin-top:8px;font-size:14px}.story{background:#fef9c3;padding:12px;border-left:4px solid #f59e0b;font-size:13px;font-style:italic;margin-top:15px;border-radius:0 4px 4px 0;white-space:pre-wrap}.print-instructions{background:#dbeafe;border:2px solid #3b82f6;border-radius:8px;padding:20px;margin:20px 0;text-align:center}.print-button{background:#ef4444;color:white;padding:12px 24px;border:none;border-radius:6px;font-size:16px;font-weight:bold;cursor:pointer;margin:10px}.print-button:hover{background:#dc2626}</style></head><body><div class="print-instructions no-print"><h2 style="margin-top:0;color:#1e40af">�“ˆ Warranty Claims Report Ready</h2><p style="font-size:16px;margin:15px 0">Click the button below or press <strong>Ctrl+P</strong> / <strong>Cmd+P</strong></p><button class="print-button" onclick="window.print()">🖨️ Print to PDF</button><p style="font-size:14px;color:#64748b;margin-top:15px">In the print dialog, select "Save as PDF" as your destination</p></div><h1>WARRANTY CLAIMS REPORT</h1><div class="header-info"><p><strong>RO Number:</strong> ${roDetails.roNumber}</p><p><strong>VIN:</strong> ${roDetails.vin}</p><p><strong>Customer:</strong> ${roDetails.customer}</p><p><strong>Vehicle:</strong> ${roDetails.yearModel}</p><p><strong>Mileage:</strong> ${roDetails.mileage}</p><p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p></div>${data.map(claim => `<div class="claim"><div class="claim-header">LINE ${claim.repairLine}</div><div class="claim-description">${claim.description}</div><div class="section"><div class="section-title">Damage Code</div><div>${claim.damageCode || 'Not set'}</div></div>${claim.allParts.length > 0 ? `<div class="section"><div class="section-title">Parts List</div>${claim.allParts.map(part => `<div class="part-item ${claim.mainPart && part.partNumber === claim.mainPart.partNumber ? 'part-main' : ''}"><strong>${part.partNumber}</strong> - ${part.description} <span style="color:#64748b;">(Qty: ${part.quantity})</span>${claim.mainPart && part.partNumber === claim.mainPart.partNumber ? ' <span style="background:#059669;color:white;padding:2px 6px;border-radius:4px;font-size:11px;">MAIN PART</span>' : ''}</div>`).join('')}</div>` : ''}<div class="section"><div class="section-title">Technician Punch Times</div>${claim.technicians.map(tech => `<div class="tech-punch"><span><strong>Tech #${tech.techId}</strong></span><div class="punch-times"><span class="punch-time-item">Total: <strong>${tech.totalTime.toFixed(2)}h</strong></span><span class="punch-time-item punch-w">W: ${tech.wTime.toFixed(2)}h</span><span class="punch-time-item punch-dw">DW: ${tech.dwTime.toFixed(2)}h</span></div></div>`).join('')}</div>${claim.diagnosticOperations.length > 0 ? `<div class="section"><div class="section-title">Diagnostic Operations (DW Time)</div>${claim.diagnosticOperations.map(op => `<div class="operation"><strong>${op.opCode}</strong>: ${op.soldHours}h (Tech ${op.techId})${op.description ? `<br><span style="color:#64748b;font-size:12px;">�“‹  ${op.description}</span>` : ''}</div>`).join('')}<div class="total">Total Diagnostic Claimed: ${claim.totalDiagnosticHours.toFixed(2)} hours</div>${claim.technicians.some(t => t.dwRemaining !== 0) ? `<div class="remaining-hours" style="${claim.technicians.some(t => t.dwRemaining < 0) ? 'background:#fee2e2;border-left-color:#dc2626;' : ''}"><strong>${claim.technicians.some(t => t.dwRemaining < 0) ? '�š ï¸ OVER-ASSIGNED DW Time:' : '�š ï¸ Unassigned DW Time:'}</strong><br>${claim.technicians.filter(t => t.dwRemaining !== 0).map(t => `Tech #${t.techId}: ${Math.abs(t.dwRemaining).toFixed(2)}h ${t.dwRemaining < 0 ? 'OVER-ASSIGNED �š ï¸' : 'remaining'}`).join('<br>')}</div>` : '<div style="color:#059669;font-weight:bold;margin-top:8px;">�œ“ All DW time perfectly assigned</div>'}</div>` : `${claim.technicians.some(t => t.dwTime > 0) ? `<div class="section"><div class="section-title">Diagnostic Operations (DW Time)</div><div style="color:#dc2626;font-weight:bold;">�š ï¸ No diagnostic operations assigned</div><div class="remaining-hours"><strong>Available DW Time:</strong><br>${claim.technicians.filter(t => t.dwTime > 0).map(t => `Tech #${t.techId}: ${t.dwTime.toFixed(2)}h available`).join('<br>')}</div></div>` : ''}`}${claim.repairOperations.length > 0 ? `<div class="section"><div class="section-title">Repair Operations (W Time)</div>${claim.repairOperations.map(op => `<div class="operation"><strong>${op.opCode}</strong>: ${op.soldHours}h (Tech ${op.techId})${op.description ? `<br><span style="color:#64748b;font-size:12px;">�“‹  ${op.description}</span>` : ''}</div>`).join('')}<div class="total">Total Repair Claimed: ${claim.totalRepairHours.toFixed(2)} hours</div>${claim.technicians.some(t => t.wRemaining !== 0) ? `<div class="remaining-hours" style="${claim.technicians.some(t => t.wRemaining < 0) ? 'background:#fee2e2;border-left-color:#dc2626;' : ''}"><strong>${claim.technicians.some(t => t.wRemaining < 0) ? '�š ï¸ OVER-ASSIGNED W Time:' : '�š ï¸ Unassigned W Time:'}</strong><br>${claim.technicians.filter(t => t.wRemaining !== 0).map(t => `Tech #${t.techId}: ${Math.abs(t.wRemaining).toFixed(2)}h ${t.wRemaining < 0 ? 'OVER-ASSIGNED �š ï¸' : 'remaining'}`).join('<br>')}</div>` : '<div style="color:#059669;font-weight:bold;margin-top:8px;">�œ“ All W time perfectly assigned</div>'}</div>` : `${claim.technicians.some(t => t.wTime > 0) ? `<div class="section"><div class="section-title">Repair Operations (W Time)</div><div style="color:#dc2626;font-weight:bold;">�š ï¸ No repair operations assigned</div><div class="remaining-hours"><strong>Available W Time:</strong><br>${claim.technicians.filter(t => t.wTime > 0).map(t => `Tech #${t.techId}: ${t.wTime.toFixed(2)}h available`).join('<br>')}</div></div>` : ''}`}${claim.story && claim.story !== 'No story available' ? `<div class="story"><strong>Tech Story:</strong><br>${claim.story}</div>` : ''}</div>`).join('')}<div style="text-align:center;margin-top:40px;color:#94a3b8;font-size:12px;">Generated by WarrantyMAX Claim Builder on ${new Date().toLocaleString()}</div></body></html>`;
                    const blob = new Blob([printContent], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `warranty-claims-${roDetails?.roNumber || 'export'}-${new Date().toISOString().split('T')[0]}.html`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setError('�œ“ HTML file downloaded! Open it and click "Print to PDF"');
                    setTimeout(() => setError(''), 5000);
                } catch (err) {
                    console.error('PDF generation error:', err);
                    setError(`PDF generation failed: ${err.message}`);
                }
            };

            const saveWorkSession = async () => {
                try {
                    if (!roDetails) {
                        setError("No RO loaded.");
                        return;
                    }
                    
                    const warrantyLines = Object.entries(parsedData?.aggregated || {}).filter(([line]) => isWarrantyLine(line));
                    if (db && userId && isAuthReady && warrantyLines.length > 0) {
                        setError('Saving claims to database...');
                        for (const [line] of warrantyLines) {
                            await saveClaimToHistory(line);
                        }
                        setError('Saved claims to history!');
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }
                    
                    const sessionData = {
                        version: '1.0',
                        savedAt: new Date().toISOString(),
                        punchData,
                        manualRoText,
                        parsedData,
                        roDetails,
                        warrantyData,
                        activeTab,
                        vmiData,
                        manualWarrantyLines: Array.from(manualWarrantyLines),
                        originalStories,
                        editedStories
                    };
                    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `warranty-session-${roDetails?.roNumber || 'saved'}-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setError('�œ“ Session saved!');
                    setTimeout(() => setError(''), 3000);
                } catch (err) {
                    setError(`Save error: ${err.message}`);
                }
            };

            const handleImportSession = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    const text = await file.text();
                    const sessionData = JSON.parse(text);
                    if (!sessionData.version || !sessionData.roDetails) {
                        setError('Invalid session file');
                        return;
                    }
                    setPunchData(sessionData.punchData || '');
                    setManualRoText(sessionData.manualRoText || '');
                    setParsedData(sessionData.parsedData || null);
                    setRoDetails(sessionData.roDetails || null);
                    setWarrantyData(sessionData.warrantyData || {});
                    setVmiData(sessionData.vmiData || null);
                    setActiveTab(sessionData.activeTab || 'all');
                    setManualWarrantyLines(new Set(sessionData.manualWarrantyLines || []));
                    setEditedStories(sessionData.editedStories || {});
                    setOriginalStories(sessionData.originalStories || {});
                    
                    // Import claims to database
                    const importCount = await importClaimsToDatabase(sessionData);
                    
                    setShowImportModal(false);
                    setError(`�œ“ Session loaded! RO #${sessionData.roDetails.roNumber}${importCount > 0 ? ` �€¢ ${importCount} claims imported to database` : ''}`);
                    setTimeout(() => setError(''), 5000);
                    
                    if (importCount > 0) {
                        await fetchClaimHistory();
                    }
                } catch (err) {
                    setError(`Import error: ${err.message}`);
                }
                if (importFileRef.current) importFileRef.current.value = '';
            };

            const fetchDatabaseData = async () => {
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready. Please wait.");
                    return;
                }
                setIsDbLoading(true);
                try {
                    console.log('Fetching database data for user:', userId);
                    const acronymsPath = `artifacts/${CONFIG.appId}/users/${userId}/customAcronyms`;
                    console.log('Acronyms path:', acronymsPath);
                    const acronymsSnapshot = await db.collection(acronymsPath).get();
                    console.log('Acronyms found:', acronymsSnapshot.docs.length);
                    setCustomAcronyms(acronymsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                    const prefsPath = `artifacts/${CONFIG.appId}/users/${userId}/customPreferences`;
                    console.log('Preferences path:', prefsPath);
                    const prefsSnapshot = await db.collection(prefsPath).get();
                    console.log('Preferences found:', prefsSnapshot.docs.length);
                    setCustomPreferences(prefsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                    
                    if (acronymsSnapshot.docs.length === 0 && prefsSnapshot.docs.length === 0) {
                        console.log('Database is empty - this is normal for first use');
                    }
                } catch (err) {
                    console.error("Failed to fetch database data:", err);
                    setError("Failed to load database: " + err.message);
                } finally {
                    setIsDbLoading(false);
                }
            };

            const handleAddAcronym = async () => {
                if (!newAcronym.trim() || !newDefinition.trim()) {
                    setError("Enter both acronym and definition.");
                    setTimeout(() => setError(''), 3000);
                    return;
                }
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return;
                }
                setIsDbLoading(true);
                try {
                    const acrCollection = db.collection(`artifacts/${CONFIG.appId}/users/${userId}/customAcronyms`);
                    const existing = await acrCollection.where("acronym", "==", newAcronym.toUpperCase()).get();
                    if (!existing.empty) {
                        setError("Acronym already exists.");
                        setIsDbLoading(false);
                        setTimeout(() => setError(''), 3000);
                        return;
                    }
                    await acrCollection.add({ acronym: newAcronym.toUpperCase(), definition: newDefinition });
                    setNewAcronym('');
                    setNewDefinition('');
                    setError('�œ“ Acronym added!');
                    setTimeout(() => setError(''), 2000);
                    await fetchDatabaseData();
                } catch (err) {
                    console.error("Error adding acronym:", err);
                    setError("Failed to add acronym: " + err.message);
                } finally {
                    setIsDbLoading(false);
                }
            };

            const handleDeleteAcronym = async (id) => {
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return;
                }
                setIsDbLoading(true);
                try {
                    await db.doc(`artifacts/${CONFIG.appId}/users/${userId}/customAcronyms/${id}`).delete();
                    await fetchDatabaseData();
                } catch (err) {
                    setError("Failed to delete acronym.");
                } finally {
                    setIsDbLoading(false);
                }
            };

            const handleAddPreference = async () => {
                if (!newPreference.trim()) {
                    setError("Enter a preference.");
                    setTimeout(() => setError(''), 3000);
                    return;
                }
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return;
                }
                setIsDbLoading(true);
                try {
                    const prefCollection = db.collection(`artifacts/${CONFIG.appId}/users/${userId}/customPreferences`);
                    const existing = await prefCollection.where("preference", "==", newPreference).get();
                    if (!existing.empty) {
                        setError("Preference already exists.");
                        setIsDbLoading(false);
                        setTimeout(() => setError(''), 3000);
                        return;
                    }
                    await prefCollection.add({ preference: newPreference });
                    setNewPreference('');
                    setError('�œ“ Preference added!');
                    setTimeout(() => setError(''), 2000);
                    await fetchDatabaseData();
                } catch (err) {
                    console.error("Error adding preference:", err);
                    setError("Failed to add preference: " + err.message);
                } finally {
                    setIsDbLoading(false);
                }
            };

            const handleDeletePreference = async (id) => {
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return;
                }
                setIsDbLoading(true);
                try {
                    await db.doc(`artifacts/${CONFIG.appId}/users/${userId}/customPreferences/${id}`).delete();
                    await fetchDatabaseData();
                } catch (err) {
                    setError("Failed to delete preference.");
                } finally {
                    setIsDbLoading(false);
                }
            };

            const migrateDataFromOldUser = async () => {
                if (!oldUserId.trim()) {
                    setError("Enter old user ID.");
                    return;
                }
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return;
                }
                if (oldUserId === userId) {
                    setError("Old user ID is the same as current!");
                    return;
                }

                setIsMigrating(true);
                setError('Migrating data...');

                try {
                    let migratedCount = 0;

                    // Migrate acronyms
                    const oldAcronymsPath = `artifacts/${CONFIG.appId}/users/${oldUserId}/customAcronyms`;
                    const oldAcronymsSnapshot = await db.collection(oldAcronymsPath).get();
                    console.log('Found', oldAcronymsSnapshot.docs.length, 'acronyms to migrate');

                    for (const doc of oldAcronymsSnapshot.docs) {
                        const data = doc.data();
                        const newAcrCollection = db.collection(`artifacts/${CONFIG.appId}/users/${userId}/customAcronyms`);
                        const existing = await newAcrCollection.where("acronym", "==", data.acronym).get();
                        if (existing.empty) {
                            await newAcrCollection.add(data);
                            migratedCount++;
                        }
                    }

                    // Migrate preferences
                    const oldPrefsPath = `artifacts/${CONFIG.appId}/users/${oldUserId}/customPreferences`;
                    const oldPrefsSnapshot = await db.collection(oldPrefsPath).get();
                    console.log('Found', oldPrefsSnapshot.docs.length, 'preferences to migrate');

                    for (const doc of oldPrefsSnapshot.docs) {
                        const data = doc.data();
                        const newPrefCollection = db.collection(`artifacts/${CONFIG.appId}/users/${userId}/customPreferences`);
                        const existing = await newPrefCollection.where("preference", "==", data.preference).get();
                        if (existing.empty) {
                            await newPrefCollection.add(data);
                            migratedCount++;
                        }
                    }

                    setError(`�œ“ Migrated ${migratedCount} items!`);
                    setShowMigrationDialog(false);
                    await fetchDatabaseData();
                    setTimeout(() => setError(''), 3000);
                } catch (err) {
                    console.error('Migration error:', err);
                    setError(`Migration failed: ${err.message}`);
                } finally {
                    setIsMigrating(false);
                }
            };

            const exportDatabase = () => {
                try {
                    const exportData = {
                        version: '1.0',
                        exportedAt: new Date().toISOString(),
                        userId: userId,
                        acronyms: customAcronyms.map(a => ({ acronym: a.acronym, definition: a.definition })),
                        preferences: customPreferences.map(p => ({ preference: p.preference }))
                    };
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `translation-database-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setError('�œ“ Database exported!');
                    setTimeout(() => setError(''), 2000);
                } catch (err) {
                    setError(`Export failed: ${err.message}`);
                }
            };

            const importDatabase = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!isAuthReady || !db || !userId) {
                    setError("Database not ready.");
                    return;
                }

                setIsDbLoading(true);
                try {
                    const text = await file.text();
                    const importData = JSON.parse(text);
                    
                    if (!importData.version || !importData.acronyms || !importData.preferences) {
                        setError('Invalid database file');
                        setIsDbLoading(false);
                        return;
                    }

                    let importedCount = 0;

                    // Import acronyms
                    for (const acr of importData.acronyms) {
                        const acrCollection = db.collection(`artifacts/${CONFIG.appId}/users/${userId}/customAcronyms`);
                        const existing = await acrCollection.where("acronym", "==", acr.acronym).get();
                        if (existing.empty) {
                            await acrCollection.add(acr);
                            importedCount++;
                        }
                    }

                    // Import preferences
                    for (const pref of importData.preferences) {
                        const prefCollection = db.collection(`artifacts/${CONFIG.appId}/users/${userId}/customPreferences`);
                        const existing = await prefCollection.where("preference", "==", pref.preference).get();
                        if (existing.empty) {
                            await prefCollection.add(pref);
                            importedCount++;
                        }
                    }

                    setError(`�œ“ Imported ${importedCount} items!`);
                    await fetchDatabaseData();
                    setTimeout(() => setError(''), 3000);
                } catch (err) {
                    console.error('Import error:', err);
                    setError(`Import failed: ${err.message}`);
                } finally {
                    setIsDbLoading(false);
                }
                e.target.value = '';
            };

            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8 no-print">
                            <h1 className="text-2xl font-bold text-slate-800">WarrantyMAX Claim Builder</h1>
                            <p className="text-slate-600">Taking the worry out of warranty</p>
                        </div>

                        {!user && (
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Sign in to continue</h2>
                                <button onClick={signInWithGoogle} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Sign in with Google
                                </button>
                            </div>
                        )}

                        {user && (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />}
                                    <span className="text-sm font-medium text-slate-700">{user.email}</span>
                                </div>
                                <button onClick={signOut} className="text-sm text-red-600 hover:text-red-700 font-medium">Sign Out</button>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-4 no-print">
                            <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-indigo-200">
                                <Icons.Upload className="w-4 h-4" />Import
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => { fetchDatabaseData(); setShowDatabaseModal(true); }} className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-purple-200">
                                    <Icons.Book className="w-4 h-4" />Database
                                </button>
                                <button onClick={() => { fetchClaimHistory(); setShowAnalyticsModal(true); }} className="flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-cyan-200">
                                    <Icons.Sparkles className="w-4 h-4" />Analytics ({claimHistory.length})
                                </button>
                            </div>
                            <div className="flex gap-2">
                                {parsedData && roDetails && (
                                    <button onClick={saveWorkSession} className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-green-200">
                                        <Icons.Save className="w-4 h-4" />Save
                                    </button>
                                )}
                                {parsedData && (
                                    <button onClick={batchTranslateStories} disabled={isAnalyzing} className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-purple-200 disabled:opacity-50">
                                        <Icons.Sparkles className="w-4 h-4" />Batch Translate
                                    </button>
                                )}
                                <button onClick={() => setShowInputSection(!showInputSection)} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                                    {showInputSection ? <><Icons.ChevronUp className="w-4 h-4" />Hide</> : <><Icons.ChevronDown className="w-4 h-4" />Show</>}
                                </button>
                            </div>
                        </div>

                        {showInputSection && (
                            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 no-print">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                            <Icons.FileText className="w-4 h-4 mr-2" />1. Upload RO PDF
                                        </label>
                                        <input ref={roFileInputRef} type="file" accept=".pdf" onChange={(e) => handlePdfUpload(e, 'ro')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100" />
                                        {roPdfFile && <p className="text-xs text-green-600 mt-1">�œ“ {roPdfFile.name}</p>}
                                        <textarea value={manualRoText} onChange={(e) => setManualRoText(e.target.value)} placeholder="Or paste text..." className="w-full h-28 mt-2 p-3 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                            <Icons.Car className="w-4 h-4 mr-2" />2. Upload VMI PDF (Optional)
                                        </label>
                                        <input ref={vmiFileInputRef} type="file" accept=".pdf" onChange={(e) => handlePdfUpload(e, 'vmi')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 disabled:opacity-50" disabled={!roDetails} />
                                        {vmiPdfFile && <p className="text-xs text-green-600 mt-1">�œ“ {vmiPdfFile.name}</p>}
                                    </div>
                                </div>
                                <div className="mb-4 mt-6">
                                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                        <Icons.Clock className="w-4 h-4 mr-2" />3. Paste Punch Times
                                    </label>
                                    <textarea value={punchData} onChange={(e) => setPunchData(e.target.value)} placeholder="19SEP25  09:15   09:50     0.58    DW     2942  A" className="w-full h-40 p-3 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                        {isAnalyzing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Processing...</> : 'Parse & Analyze'}
                                    </button>
                                    <button onClick={clearAll} className="bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300">Clear</button>
                                </div>
                                {error && <div className={`mt-4 ${error.startsWith('�œ“') ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} border-l-4 p-4 rounded`}><div className="flex items-center"><Icons.Alert className={`w-5 h-5 ${error.startsWith('�œ“') ? 'text-green-400' : 'text-red-400'} mr-2`} /><p className={`text-sm ${error.startsWith('�œ“') ? 'text-green-700' : 'text-red-700'}`}>{error}</p></div></div>}
                            </div>
                        )}

                        {roDetails && (
                            <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm py-2 shadow-sm no-print">
                                <div className="bg-white rounded-xl shadow-lg p-3 mb-2">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-1 text-xs">
                                        <div className="flex gap-2"><span className="text-slate-500 font-medium">RO:</span><span className="font-semibold">{roDetails.roNumber}</span></div>
                                        <div className="flex gap-2 items-center">
                                            <span className="text-slate-500 font-medium">VIN:</span>
                                            <span className="font-mono font-semibold">{roDetails.vin}</span>
                                            <button onClick={() => Utils.copyToClipboard(roDetails.vin, 'VIN', setError)} className="ml-1 p-1 hover:bg-slate-100 rounded">
                                                <Icons.Copy className="w-3 h-3 text-slate-500" />
                                            </button>
                                        </div>
                                        <div className="flex gap-2"><span className="text-slate-500 font-medium">Customer:</span><span className="font-semibold truncate">{roDetails.customer}</span></div>
                                        <div className="flex gap-2"><span className="text-slate-500 font-medium">Vehicle:</span><span className="font-semibold">{roDetails.yearModel}</span></div>
                                        <div className="flex gap-2"><span className="text-slate-500 font-medium">Miles:</span><span className="font-semibold">{roDetails.mileage}</span></div>
                                        <div className="flex gap-2"><span className="text-slate-500 font-medium">Due:</span><span className="font-semibold">{roDetails.promisedDate}</span></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {parsedData && (
                            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                                <div className="flex items-center justify-between mb-4 border-b border-slate-200 no-print">
                                    <div className="flex gap-2">
                                        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>
                                            All Lines ({Object.keys(parsedData.aggregated).length})
                                        </button>
                                        <button onClick={() => setActiveTab('warranty')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'warranty' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>
                                            Warranty ({Object.keys(parsedData.aggregated).filter(line => isWarrantyLine(line)).length})
                                        </button>
                                        {vmiData && (
                                            <button onClick={() => setActiveTab('vmi')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'vmi' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>VMI</button>
                                        )}
                                    </div>
                                    {activeTab === 'warranty' && Object.keys(parsedData.aggregated).filter(line => isWarrantyLine(line)).length > 0 && (
                                        <button onClick={downloadPDF} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                                            <Icons.FileText className="w-4 h-4" />Export PDF
                                        </button>
                                    )}
                                </div>

                                {activeTab !== 'vmi' && <div className="space-y-3">
                                    {Object.entries(getFilteredLines()).map(([line, data]) => {
                                        const lineDetails = roDetails?.lines?.[line];
                                        const isExpanded = expandedLines.has(line);
                                        const isWarranty = isWarrantyLine(line);
                                        const lineWarrantyData = warrantyData[line] || { mainPartIndex: null, damageCode: '', diagnosticOps: [], repairOps: [] };

                                        return (
                                            <div key={line} className="border-2 border-slate-200 rounded-lg overflow-hidden hover:border-indigo-300">
                                                <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-4 cursor-pointer no-print" onClick={() => toggleLine(line)}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="text-2xl font-bold text-indigo-600">Line {line}</span>
                                                                {lineDetails?.laborType && (
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isWarranty ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>{lineDetails.laborType}</span>
                                                                )}
                                                                <button onClick={(e) => { e.stopPropagation(); handleWarrantyToggle(line); }} className={`px-3 py-1 rounded-full text-xs font-bold ${isWarranty ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                                    {isWarranty ? '�œ“ Warranty' : '+ Add'}
                                                                </button>
                                                            </div>
                                                            <p className="text-sm text-slate-700 font-medium">{lineDetails?.description || 'No description'}</p>
                                                            <div className="flex gap-6 mt-2 text-xs text-slate-600">
                                                                <span><strong>Total:</strong> {data.totalTime.toFixed(2)}h</span>
                                                                <span className="text-blue-600"><strong>DW:</strong> {data.dwTime.toFixed(2)}h</span>
                                                                <span className="text-green-600"><strong>W:</strong> {data.wTime.toFixed(2)}h</span>
                                                                <span><strong>Techs:</strong> {Object.keys(data.technicians).length}</span>
                                                            </div>
                                                        </div>
                                                        {isExpanded ? <Icons.ChevronUp className="w-6 h-6 text-indigo-600" /> : <Icons.ChevronDown className="w-6 h-6 text-slate-400" />}
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="p-4 bg-white border-t border-slate-200">
                                                        {lineDetails?.story && lineDetails.story !== 'No story available' && (
                                                            <div className="mb-4 no-print">
                                                                <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-4">
                                                                    <textarea value={editedStories[line] !== undefined ? editedStories[line] : lineDetails.story} onChange={(e) => handleStoryChange(line, e.target.value)} className="w-full h-32 p-2 border border-slate-300 rounded text-sm" />
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        <button onClick={() => Utils.copyToClipboard(editedStories[line] !== undefined ? editedStories[line] : lineDetails.story, 'Story', setError)} className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-semibold">Copy</button>
                                                                        <button onClick={async () => {
                                                                            const story = editedStories[line] !== undefined ? editedStories[line] : lineDetails.story;
                                                                            setOriginalStories(prev => ({ ...prev, [line]: story }));
                                                                            const result = await translateStory(line, story, setError);
                                                                            if (result) setEditedStories(prev => ({ ...prev, [line]: result }));
                                                                        }} disabled={isTranslating[line]} className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50">
                                                                            {isTranslating[line] ? 'Translating...' : 'Translate'}
                                                                        </button>
                                                                        {originalStories[line] && (
                                                                            <button onClick={() => undoTranslation(line)} className="bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-semibold">Revert</button>
                                                                        )}
                                                                        {originalStories[line] && editedStories[line] && editedStories[line] !== originalStories[line] && (
                                                                            <button onClick={() => learnFromEdit(line, editedStories[line], originalStories[line], setError, fetchDatabaseData)} disabled={isLearning[line]} className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50">
                                                                                {isLearning[line] ? 'Learning...' : 'Learn'}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {data && data.technicians && (
                                                            <div className="mb-4 no-print">
                                                                <div className="bg-gradient-to-r from-slate-100 to-slate-50 border-2 border-slate-300 rounded-lg overflow-hidden">
                                                                    <div className="bg-slate-200 px-4 py-2 border-b border-slate-300">
                                                                        <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
                                                                            <Icons.Clock className="w-4 h-4" />Technician Punches
                                                                        </h3>
                                                                    </div>
                                                                    <div className="p-4 bg-white">
                                                                        {Object.entries(data.technicians).map(([techId, techData]) => {
                                                                            const wRemaining = activeTab === 'warranty' && isWarranty ? getRemainingHours(line, techId, 'W') : 0;
                                                                            const dwRemaining = activeTab === 'warranty' && isWarranty ? getRemainingHours(line, techId, 'DW') : 0;
                                                                            return (
                                                                                <div key={techId} className="mb-3 last:mb-0 bg-slate-50 rounded-lg p-3 border border-slate-200">
                                                                                    <div className="flex items-center justify-between mb-2">
                                                                                        <span className="text-sm font-bold text-slate-800">Tech #{techId}</span>
                                                                                        <div className="flex gap-2 text-xs">
                                                                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">DW: {techData.dwTime.toFixed(2)}h</span>
                                                                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">W: {techData.wTime.toFixed(2)}h</span>
                                                                                            <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded font-semibold">Total: {techData.totalTime.toFixed(2)}h</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    {activeTab === 'warranty' && isWarranty && (
                                                                                        <div className="flex gap-2 text-xs mb-2">
                                                                                            <span className={`px-2 py-1 rounded font-semibold ${dwRemaining < 0 ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                                                                                                DW {dwRemaining < 0 ? 'OVER-ASSIGNED' : 'Available'}: {Math.abs(dwRemaining).toFixed(2)}h{dwRemaining < 0 && ' �š ï¸'}
                                                                                            </span>
                                                                                            <span className={`px-2 py-1 rounded font-semibold ${wRemaining < 0 ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                                                                                                W {wRemaining < 0 ? 'OVER-ASSIGNED' : 'Available'}: {Math.abs(wRemaining).toFixed(2)}h{wRemaining < 0 && ' �š ï¸'}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="space-y-1">
                                                                                        {techData.punches.map((punch, idx) => (
                                                                                            <div key={`punch-${techId}-${idx}`} className={`text-xs py-1.5 px-2 rounded flex justify-between items-center border ${punch.type === 'DW' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
                                                                                                <span className="font-mono text-[11px]">{punch.date} {punch.start}-{punch.end}</span>
                                                                                                <span className="font-bold">{punch.type}: {punch.time.toFixed(2)}h</span>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {lineDetails?.laborType?.includes('W') && roDetails?.vin !== 'N/A' && (
                                                            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 no-print">
                                                                <div className="flex items-center justify-between gap-4 mb-2">
                                                                    <span className="text-xs font-semibold text-blue-700">Warranty Resources:</span>
                                                                    <button onClick={() => Utils.copyToClipboard(roDetails.vin, 'VIN', setError)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-xs flex items-center gap-1">
                                                                        <Icons.FileText className="w-3 h-3" />Copy VIN
                                                                    </button>
                                                                </div>
                                                                <div className="flex gap-2 flex-wrap">
                                                                    <a href={`https://netstar.i.mercedes-benz.com/netstar/service/vehicle-information?vins=${roDetails.vin}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded border border-blue-300 text-xs">VMI</a>
                                                                    <a href={`https://xentry.mercedes-benz.com/xot/session/${roDetails.vin}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded border border-blue-300 text-xs">XOT</a>
                                                                    <a href={`https://xentry.mercedes-benz.com/xhpi/ng/inquiry?ident=${roDetails.vin}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded border border-blue-300 text-xs">XHPi</a>
                                                                    <a href="https://xentry.mercedes-benz.com/rpr/#/ws-vehicle1" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded border border-blue-300 text-xs">XRP</a>
                                                                    <a href="https://xentry.mercedes-benz.com/tips-reader/search/topics" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded border border-blue-300 text-xs">TIPS</a>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {activeTab === 'warranty' && isWarranty && (
                                                            <div className="mb-4 bg-amber-50 border-2 border-amber-200 rounded p-4 no-print">
                                                                <div className="flex justify-between mb-3">
                                                                    <h3 className="text-sm font-bold text-amber-900">CLAIM BUILDER</h3>
                                                                    <div className="flex gap-2">
                                                                        <button 
                                                                            onClick={() => getAISuggestions(line, warrantyData[line]?.damageCode, lineDetails?.description)} 
                                                                            disabled={isLoadingSuggestions}
                                                                            className="bg-cyan-600 text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50 flex items-center gap-1"
                                                                        >
                                                                            <Icons.Sparkles className="w-3 h-3" />
                                                                            {isLoadingSuggestions ? 'Analyzing...' : 'AI Suggest'}
                                                                        </button>
                                                                        <button onClick={() => handleXotImport(line)} className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-semibold">Import XOT</button>
                                                                        <button 
                                                                            onClick={() => saveClaimToHistory(line)} 
                                                                            className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1"
                                                                        >
                                                                            <Icons.Save className="w-3 h-3" />
                                                                            Save Claim
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {suggestions[line] && (
                                                                    <div className="mb-4 bg-cyan-50 border-2 border-cyan-300 rounded-lg p-3">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <h4 className="text-xs font-bold text-cyan-900 flex items-center gap-1">
                                                                                <Icons.Sparkles className="w-4 h-4" />
                                                                                AI SUGGESTIONS ({suggestions[line].confidence} confidence)
                                                                            </h4>
                                                                            <button 
                                                                                onClick={() => applySuggestedOperations(line, suggestions[line])}
                                                                                className="bg-cyan-600 text-white px-2 py-1 rounded text-xs font-semibold"
                                                                            >
                                                                                Apply All
                                                                            </button>
                                                                        </div>
                                                                        {suggestions[line].notes && (
                                                                            <p className="text-xs text-cyan-800 mb-2 italic">{suggestions[line].notes}</p>
                                                                        )}
                                                                        {suggestions[line].suggestedDiagnostic?.length > 0 && (
                                                                            <div className="mb-2">
                                                                                <p className="text-xs font-semibold text-blue-700 mb-1">Diagnostic:</p>
                                                                                {suggestions[line].suggestedDiagnostic.map((op, idx) => (
                                                                                    <div key={idx} className="bg-white rounded px-2 py-1 mb-1 text-xs flex items-start justify-between gap-2">
                                                                                        <div className="flex-1">
                                                                                            <div className="font-semibold mb-0.5">
                                                                                                <span className="font-mono">{op.opCode}</span> ({op.hours}h{op.isZM && ' - ZM'}) 
                                                                                                {op.sampleCount && <span className="text-slate-500"> • Avg from {op.sampleCount} claims</span>}
                                                                                            </div>
                                                                                            {op.opDescription && <div className="text-slate-700 mb-0.5">{op.opDescription}</div>}
                                                                                            {op.reason && <div className="text-slate-500 italic">{op.reason}</div>}
                                                                                        </div>
                                                                                        <button 
                                                                                            onClick={() => applySingleOperation(line, op, 'diagnostic')}
                                                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
                                                                                        >
                                                                                            + Add
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {suggestions[line].suggestedRepair?.length > 0 && (
                                                                            <div>
                                                                                <p className="text-xs font-semibold text-green-700 mb-1">Repair:</p>
                                                                                {suggestions[line].suggestedRepair.map((op, idx) => (
                                                                                    <div key={idx} className="bg-white rounded px-2 py-1 mb-1 text-xs flex items-start justify-between gap-2">
                                                                                        <div className="flex-1">
                                                                                            <div className="font-semibold mb-0.5">
                                                                                                <span className="font-mono">{op.opCode}</span> ({op.hours}h{op.isZM && ' - ZM'})
                                                                                                {op.sampleCount && <span className="text-slate-500"> • Avg from {op.sampleCount} claims</span>}
                                                                                            </div>
                                                                                            {op.opDescription && <div className="text-slate-700 mb-0.5">{op.opDescription}</div>}
                                                                                            {op.reason && <div className="text-slate-500 italic">{op.reason}</div>}
                                                                                        </div>
                                                                                        <button 
                                                                                            onClick={() => applySingleOperation(line, op, 'repair')}
                                                                                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
                                                                                        >
                                                                                            + Add
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {suggestions[line].relevantClaims?.length > 0 && (
                                                                            <details className="mt-2">
                                                                                <summary className="text-xs font-semibold cursor-pointer text-cyan-700">
                                                                                    Based on {suggestions[line].relevantClaims.length} similar claims
                                                                                </summary>
                                                                                <div className="mt-1 space-y-1">
                                                                                    {suggestions[line].relevantClaims.slice(0, 3).map((claim, idx) => (
                                                                                        <div key={idx} className="bg-white rounded px-2 py-1 text-xs">
                                                                                            <span className="font-semibold">{claim.damageCode}</span> on {claim.model} - RO #{claim.roNumber}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </details>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <div className="mb-4">
                                                                    <label className="text-xs font-semibold mb-1 block">Damage Code</label>
                                                                    <div className="flex gap-2">
                                                                        <input type="text" value={lineWarrantyData.damageCode} onChange={(e) => updateWarrantyField(line, 'damageCode', e.target.value)} placeholder="Enter damage code" className="flex-1 px-3 py-2 border rounded text-sm" />
                                                                        <button onClick={() => {
                                                                            const damageCodeOnly = lineWarrantyData.damageCode.trim().substring(0, 8);
                                                                            Utils.copyToClipboard(damageCodeOnly, 'Damage Code (8-char)', setError);
                                                                        }} className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg" title="Copy 8-char damage code">
                                                                            <Icons.Copy className="w-4 h-4 text-white" />
                                                                        </button>
                                                                        <button onClick={() => Utils.copyToClipboard(lineWarrantyData.damageCode, 'Full Damage Code', setError)} className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg" title="Copy full damage code">
                                                                            <Icons.Copy className="w-4 h-4 text-slate-600" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="mb-4">
                                                                    <div className="flex justify-between mb-2">
                                                                        <label className="text-xs font-semibold">Diagnostic (DW)</label>
                                                                        <button onClick={() => addOpCode(line, 'diagnostic')} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">+ Add</button>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                                        {[['541011', 0.2], ['540650', 0.1], ['547989', 0.1], ['540991', 0.3], ['970001', 0.0]].map(([code, hrs]) => (
                                                                            <button key={code} onClick={() => addPresetDiagnostic(line, code, hrs)} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{code} ({hrs}h)</button>
                                                                        ))}
                                                                    </div>
                                                                    {lineWarrantyData.diagnosticOps.map((op, idx) => (
                                                                        <div key={idx} className="bg-blue-50 p-3 rounded mb-2 border border-blue-200">
                                                                            <div className="flex gap-2 items-start mb-2">
                                                                                <input type="text" value={op.opCode} onChange={(e) => updateOpCode(line, 'diagnostic', idx, 'opCode', e.target.value)} placeholder="Op Code" className="w-24 px-2 py-1 border rounded text-xs" />
                                                                                <input type="number" step="0.1" value={op.soldHours} onChange={(e) => updateOpCode(line, 'diagnostic', idx, 'soldHours', e.target.value)} placeholder="Hours" className="w-20 px-2 py-1 border rounded text-xs" />
                                                                                <select value={op.tech} onChange={(e) => updateOpCode(line, 'diagnostic', idx, 'tech', e.target.value)} className="flex-1 px-2 py-1 border rounded text-xs">
                                                                                    <option value="">Tech</option>
                                                                                    {Object.keys(data.technicians).map(techId => {
                                                                                        const remaining = getRemainingHours(line, techId, 'DW');
                                                                                        return (
                                                                                            <option key={techId} value={techId}>Tech #{techId} (DW: {remaining >= 0 ? `${remaining.toFixed(2)}h left` : `${Math.abs(remaining).toFixed(2)}h OVER �š ï¸`})</option>
                                                                                        );
                                                                                    })}
                                                                                </select>
                                                                                <button onClick={() => toggleOpType(line, 'diagnostic', idx)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap" title="Move to Repair">�†’ Repair</button>
                                                                                <button onClick={() => updateOpCode(line, 'diagnostic', idx, 'isZM', !op.isZM)} className={`px-2 py-1 rounded text-xs font-semibold ${op.isZM ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`} title="Toggle ZM (no set time)">ZM</button>
                                                                                <button onClick={() => removeOpCode(line, 'diagnostic', idx)} className="text-red-500"><Icons.Trash className="w-4 h-4" /></button>
                                                                            </div>
                                                                            {op.description && (
                                                                                <div className="text-xs text-slate-600 italic bg-white px-2 py-1 rounded border border-blue-100">�“‹  {op.description}</div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div>
                                                                    <div className="flex justify-between mb-2">
                                                                        <label className="text-xs font-semibold">Repair (W)</label>
                                                                        <button onClick={() => addOpCode(line, 'repair')} className="bg-green-500 text-white px-2 py-1 rounded text-xs">+ Add</button>
                                                                    </div>
                                                                    {lineWarrantyData.repairOps.map((op, idx) => (
                                                                        <div key={idx} className="bg-green-50 p-3 rounded mb-2 border border-green-200">
                                                                            <div className="flex gap-2 items-start mb-2">
                                                                                <input type="text" value={op.opCode} onChange={(e) => updateOpCode(line, 'repair', idx, 'opCode', e.target.value)} placeholder="Op Code" className="w-24 px-2 py-1 border rounded text-xs" />
                                                                                <input type="number" step="0.1" value={op.soldHours} onChange={(e) => updateOpCode(line, 'repair', idx, 'soldHours', e.target.value)} placeholder="Hours" className="w-20 px-2 py-1 border rounded text-xs" />
                                                                                <select value={op.tech} onChange={(e) => updateOpCode(line, 'repair', idx, 'tech', e.target.value)} className="flex-1 px-2 py-1 border rounded text-xs">
                                                                                    <option value="">Tech</option>
                                                                                    {Object.keys(data.technicians).map(techId => {
                                                                                        const remaining = getRemainingHours(line, techId, 'W');
                                                                                        return (
                                                                                            <option key={techId} value={techId}>Tech #{techId} (W: {remaining >= 0 ? `${remaining.toFixed(2)}h left` : `${Math.abs(remaining).toFixed(2)}h OVER �š ï¸`})</option>
                                                                                        );
                                                                                    })}
                                                                                </select>
                                                                                <button onClick={() => updateOpCode(line, 'repair', idx, 'isZM', !op.isZM)} className={`px-2 py-1 rounded text-xs font-semibold ${op.isZM ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`} title="Toggle ZM (no set time)">ZM</button>
                                                                                <button onClick={() => toggleOpType(line, 'repair', idx)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap" title="Move to Diagnostic">�†’ Diag</button>
                                                                                <button onClick={() => removeOpCode(line, 'repair', idx)} className="text-red-500"><Icons.Trash className="w-4 h-4" /></button>
                                                                            </div>
                                                                            {op.description && (
                                                                                <div className="text-xs text-slate-600 italic bg-white px-2 py-1 rounded border border-green-100">�“‹  {op.description}</div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {lineDetails?.parts?.length > 0 && (
                                                            <div className="mb-4 no-print">
                                                                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                                                    Parts {activeTab === 'warranty' && isWarranty && '(Select Main Part)'}
                                                                </h3>
                                                                {lineDetails.parts.map((part, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded mb-1 border-l-2 border-green-400">
                                                                        {activeTab === 'warranty' && isWarranty && (
                                                                            <input type="radio" name={`mainPart-${line}`} checked={lineWarrantyData.mainPartIndex === idx} onChange={() => updateWarrantyField(line, 'mainPartIndex', idx)} className="w-4 h-4 text-green-600" />
                                                                        )}
                                                                        <div className="flex-1">
                                                                            <span className="font-mono text-slate-600">{part.partNumber}</span> - {part.description} (Qty: {part.quantity})
                                                                            {activeTab === 'warranty' && isWarranty && lineWarrantyData.mainPartIndex === idx && (
                                                                                <span className="ml-2 bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">MAIN</span>
                                                                            )}
                                                                        </div>
                                                                        {activeTab === 'warranty' && isWarranty && lineWarrantyData.mainPartIndex === idx && (
                                                                            <button onClick={() => {
                                                                                const transformedPartNumber = 'A' + part.partNumber.replace(/-/g, '');
                                                                                Utils.copyToClipboard(transformedPartNumber, 'Part Number', setError);
                                                                            }} className="p-1.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors" title="Copy Part Number (formatted)">
                                                                                <Icons.Copy className="w-3.5 h-3.5 text-white" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>}

                                {activeTab === 'vmi' && vmiData && (
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded p-6 border-2 border-indigo-200">
                                            <h3 className="text-lg font-bold mb-4">Vehicle Master Information</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div><strong>VIN:</strong><p className="font-mono">{vmiData.vin}</p></div>
                                                <div><strong>Model:</strong><p>{vmiData.modelYear}</p></div>
                                                <div><strong>Warranty:</strong><p>{vmiData.warrantyStart}</p></div>
                                                <div><strong>Engine:</strong><p>{vmiData.engineNo}</p></div>
                                            </div>
                                        </div>
                                        {vmiData.campaigns?.length > 0 && (
                                            <div>
                                                <h4 className="font-bold mb-3">Campaigns ({vmiData.campaigns.length})</h4>
                                                {vmiData.campaigns.map((c, i) => (
                                                    <div key={i} className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mb-2">
                                                        <span className="font-mono font-bold">{c.code}</span> - {c.description}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {vmiData.damageHistory?.length > 0 && (
                                            <div>
                                                <h4 className="font-bold mb-3">Damage History ({vmiData.damageHistory.length})</h4>
                                                {vmiData.damageHistory.map((d, i) => (
                                                    <div key={i} className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-3">
                                                        <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                                                            <div><strong>Date:</strong> {d.date}</div>
                                                            <div><strong>Code:</strong> {d.damageCode}</div>
                                                            <div><strong>Dealer:</strong> {d.dealer}</div>
                                                            <div><strong>RO:</strong> {d.ro}</div>
                                                        </div>
                                                        <p className="text-sm">{d.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {showImportModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                                    <div className="bg-indigo-600 text-white p-6">
                                        <h2 className="text-xl font-bold">Import Saved Work</h2>
                                    </div>
                                    <div className="p-6">
                                        <label className="block text-sm font-semibold mb-2">Import Session</label>
                                        <input ref={importFileRef} type="file" accept=".json" onChange={handleImportSession} className="block w-full text-sm" />
                                    </div>
                                    <div className="border-t p-6">
                                        <button onClick={() => setShowImportModal(false)} className="w-full bg-slate-200 text-slate-700 py-2 rounded-lg">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showXotImportModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                                    <div className="bg-purple-600 text-white p-6">
                                        <h2 className="text-xl font-bold">Import XOT Operations</h2>
                                    </div>
                                    {xotOperations.length === 0 ? (
                                        <div className="p-6">
                                            <label className="flex flex-col items-center border-2 border-dashed rounded-lg p-8 cursor-pointer">
                                                <Icons.Upload className="w-12 h-12 mb-3" />
                                                <span className="text-sm font-semibold">Select XOT XML file</span>
                                                <input type="file" accept=".xml" onChange={handleXotFileSelect} className="hidden" />
                                            </label>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1 overflow-y-auto p-6">
                                                {xotOperations.map((op, idx) => (
                                                    <div key={idx} className={`border-2 rounded p-3 mb-2 ${op.selected ? 'border-purple-300' : 'border-slate-200'}`}>
                                                        <div className="flex gap-3">
                                                            <input type="checkbox" checked={op.selected} onChange={() => toggleXotOperation(idx)} />
                                                            <div className="flex-1">
                                                                <div className="flex gap-2 mb-2">
                                                                    <span className="font-mono font-bold">{op.opCode}</span>
                                                                    <span className="bg-slate-200 px-2 rounded text-xs">{op.hours}h</span>
                                                                    <button onClick={() => toggleXotCategory(idx)} className={`px-3 py-1 rounded text-xs ${op.category === 'diagnostic' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                                                                        {op.category === 'diagnostic' ? 'Diagnostic' : 'Repair'}
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs">{op.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="border-t p-6 flex justify-between">
                                                <button onClick={() => { setShowXotImportModal(false); setXotOperations([]); }} className="bg-slate-200 px-6 py-3 rounded-lg">Cancel</button>
                                                <button onClick={importSelectedXotOps} className="bg-purple-600 text-white px-6 py-3 rounded-lg">Import</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {showWarrantyConfirmDialog && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl max-w-md w-full">
                                    <div className="bg-amber-600 text-white p-6">
                                        <h2 className="text-xl font-bold">Confirm</h2>
                                    </div>
                                    <div className="p-6">
                                        <p>{isWarrantyLine(pendingWarrantyToggle) ? 'Remove from warranty?' : 'Add to warranty?'}</p>
                                    </div>
                                    <div className="border-t p-6 flex gap-3">
                                        <button onClick={() => { setShowWarrantyConfirmDialog(false); setPendingWarrantyToggle(null); }} className="flex-1 bg-slate-200 py-2 rounded-lg">Cancel</button>
                                        <button onClick={confirmWarrantyToggle} className={`flex-1 text-white py-2 rounded-lg ${isWarrantyLine(pendingWarrantyToggle) ? 'bg-red-600' : 'bg-green-600'}`}>Confirm</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showMigrationDialog && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl max-w-md w-full">
                                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6">
                                        <h2 className="text-xl font-bold mb-2">Migrate Old Data</h2>
                                        <p className="text-sm text-amber-100">Copy database entries from a previous user session</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-4">
                                            <p className="text-sm text-blue-800"><strong>Current User ID:</strong> {userId}</p>
                                        </div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Old User ID</label>
                                        <input type="text" value={oldUserId} onChange={(e) => setOldUserId(e.target.value)} placeholder="Enter old user ID from console logs" className="w-full px-3 py-2 border border-slate-300 rounded text-sm mb-2" />
                                        <p className="text-xs text-slate-500">This will copy all acronyms and preferences from the old user ID to your current account.</p>
                                    </div>
                                    <div className="border-t p-6 flex gap-3">
                                        <button onClick={() => { setShowMigrationDialog(false); setIsMigrating(false); }} disabled={isMigrating} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg disabled:opacity-50">Cancel</button>
                                        <button onClick={migrateDataFromOldUser} disabled={isMigrating} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                                            {isMigrating ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Migrating...
                                                </>
                                            ) : 'Migrate Data'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showDatabaseModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 sticky top-0">
                                        <h2 className="text-xl font-bold mb-2">Translation Database</h2>
                                        <p className="text-sm text-purple-100 mb-3">Manage your learned acronyms and translation preferences</p>
                                        <div className="flex gap-2 flex-wrap">
                                            <button onClick={exportDatabase} className="bg-white text-purple-700 px-3 py-1.5 rounded text-sm font-semibold hover:bg-purple-50 flex items-center gap-1">
                                                <Icons.Save className="w-4 h-4" />Export Database
                                            </button>
                                            <label className="bg-white text-purple-700 px-3 py-1.5 rounded text-sm font-semibold hover:bg-purple-50 flex items-center gap-1 cursor-pointer">
                                                <Icons.Upload className="w-4 h-4" />Import Database
                                                <input type="file" accept=".json" onChange={importDatabase} className="hidden" />
                                            </label>
                                            <button onClick={() => setShowMigrationDialog(true)} className="bg-amber-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-amber-600 flex items-center gap-1">
                                                <Icons.RotateCcw className="w-4 h-4" />Migrate Old Data
                                            </button>
                                        </div>
                                        <p className="text-xs text-purple-200 mt-2">User ID: {userId}</p>
                                    </div>
                                    <div className="p-6 space-y-6 overflow-y-auto">
                                        {isDbLoading ? (
                                            <div className="text-center py-8">
                                                <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                                <p className="text-slate-600">Loading database...</p>
                                            </div>
                                        ) : (
                                            <>
                                                {customAcronyms.length === 0 && customPreferences.length === 0 && (
                                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4">
                                                        <div className="flex items-start gap-3">
                                                            <Icons.Alert className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                                            <div className="text-sm text-blue-800">
                                                                <p className="font-semibold mb-1">Your translation database is empty</p>
                                                                <p className="mb-2">This is normal for first-time use. Add custom acronyms and preferences below to improve AI translations.</p>
                                                                <p className="text-xs"><strong>Tip:</strong> Use the "Learn from Edit" button after manually editing a translated story to automatically extract patterns!</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                        <Icons.Book className="w-5 h-5" />
                                                        Custom Acronyms ({customAcronyms.length})
                                                    </h3>
                                                    <div className="space-y-2 mb-4">
                                                        {customAcronyms.length > 0 ? (
                                                            customAcronyms.map((a) => (
                                                                <div key={a.id} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                                    <span className="font-bold text-purple-900">{a.acronym}</span>
                                                                    <span className="text-slate-700 flex-1">�†’ {a.definition}</span>
                                                                    <button onClick={() => handleDeleteAcronym(a.id)} disabled={isDbLoading} className="text-red-500 hover:text-red-700 disabled:opacity-50">
                                                                        <Icons.Trash className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-slate-500 italic text-sm">No custom acronyms yet. Add your first one below!</p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 p-3 bg-slate-100 rounded-lg border">
                                                        <input type="text" value={newAcronym} onChange={(e) => setNewAcronym(e.target.value)} placeholder="Acronym (e.g., ME)" className="w-28 px-2 py-1 border border-slate-300 rounded text-sm" />
                                                        <input type="text" value={newDefinition} onChange={(e) => setNewDefinition(e.target.value)} placeholder="Definition (e.g., Motor Electronics)" className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm" />
                                                        <button onClick={handleAddAcronym} disabled={isDbLoading} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-semibold disabled:opacity-50">Add</button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                        <Icons.FileText className="w-5 h-5" />
                                                        Wording Preferences ({customPreferences.length})
                                                    </h3>
                                                    <div className="space-y-2 mb-4">
                                                        {customPreferences.length > 0 ? (
                                                            customPreferences.map((p) => (
                                                                <div key={p.id} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                                    <span className="text-slate-700 flex-1">{p.preference}</span>
                                                                    <button onClick={() => handleDeletePreference(p.id)} disabled={isDbLoading} className="text-red-500 hover:text-red-700 disabled:opacity-50">
                                                                        <Icons.Trash className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-slate-500 italic text-sm">No wording preferences yet. Add your first one below!</p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 p-3 bg-slate-100 rounded-lg border">
                                                        <input type="text" value={newPreference} onChange={(e) => setNewPreference(e.target.value)} placeholder="Enter preference (e.g., 'Use X instead of Y')" className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm" />
                                                        <button onClick={handleAddPreference} disabled={isDbLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold disabled:opacity-50">Add</button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="border-t border-slate-200 bg-slate-50 p-6 sticky bottom-0">
                                        <button onClick={() => setShowDatabaseModal(false)} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg">Close</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showAnalyticsModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-6 sticky top-0">
                                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                                            <Icons.Sparkles className="w-6 h-6" />
                                            Claim Analytics & History
                                        </h2>
                                        <p className="text-sm text-cyan-100">AI-powered insights from your warranty claim history</p>
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <div className="bg-white/10 rounded-lg p-3">
                                                <p className="text-xs text-cyan-100">Total Claims</p>
                                                <p className="text-2xl font-bold">{claimHistory.length}</p>
                                            </div>
                                            <div className="bg-white/10 rounded-lg p-3">
                                                <p className="text-xs text-cyan-100">Unique Damage Codes</p>
                                                <p className="text-2xl font-bold">{new Set(claimHistory.map(c => c.damageCodeBase)).size}</p>
                                            </div>
                                            <div className="bg-white/10 rounded-lg p-3">
                                                <p className="text-xs text-cyan-100">Total Hours Claimed</p>
                                                <p className="text-2xl font-bold">
                                                    {claimHistory.reduce((sum, c) => sum + (c.totalDiagnosticHours || 0) + (c.totalRepairHours || 0), 0).toFixed(1)}h
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6">
                                        {claimHistory.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Icons.Alert className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Claims Yet</h3>
                                                <p className="text-slate-500 mb-4">Start building warranty claims and save them to see AI-powered insights!</p>
                                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded max-w-xl mx-auto text-left">
                                                    <p className="text-sm text-blue-800 mb-2"><strong>How it works:</strong></p>
                                                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                                                        <li>Build a warranty claim with damage code and operations</li>
                                                        <li>Click "Save Claim" to add it to your history</li>
                                                        <li>AI will analyze patterns and suggest operations for future claims</li>
                                                        <li>The more claims you save, the smarter the suggestions become!</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
                                                    <h3 className="text-sm font-bold text-slate-800 mb-3">�“Š TOP PATTERNS</h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-600 mb-2">Most Common Damage Codes</p>
                                                            {Object.entries(
                                                                claimHistory.reduce((acc, claim) => {
                                                                    if (claim.damageCodeBase) {
                                                                        acc[claim.damageCodeBase] = (acc[claim.damageCodeBase] || 0) + 1;
                                                                    }
                                                                    return acc;
                                                                }, {})
                                                            )
                                                            .sort((a, b) => b[1] - a[1])
                                                            .slice(0, 5)
                                                            .map(([code, count]) => (
                                                                <div key={code} className="bg-white rounded px-3 py-2 mb-1 flex justify-between items-center">
                                                                    <span className="font-mono font-bold text-sm">{code}</span>
                                                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{count}x</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-600 mb-2">Most Common Operation Codes</p>
                                                            {Object.entries(
                                                                claimHistory.reduce((acc, claim) => {
                                                                    [...(claim.diagnosticOps || []), ...(claim.repairOps || [])].forEach(op => {
                                                                        if (op.opCode) {
                                                                            acc[op.opCode] = (acc[op.opCode] || 0) + 1;
                                                                        }
                                                                    });
                                                                    return acc;
                                                                }, {})
                                                            )
                                                            .sort((a, b) => b[1] - a[1])
                                                            .slice(0, 5)
                                                            .map(([code, count]) => (
                                                                <div key={code} className="bg-white rounded px-3 py-2 mb-1 flex justify-between items-center">
                                                                    <span className="font-mono font-bold text-sm">{code}</span>
                                                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">{count}x</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800 mb-3">�“‹  RECENT CLAIMS</h3>
                                                    <div className="space-y-3">
                                                        {claimHistory.slice(0, 20).map((claim) => (
                                                            <div key={claim.id} className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200 hover:border-cyan-300 transition-colors">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="font-mono font-bold text-lg text-cyan-700">{claim.damageCode}</span>
                                                                            <span className="bg-slate-200 px-2 py-0.5 rounded text-xs">RO #{claim.roNumber}</span>
                                                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">Line {claim.repairLine}</span>
                                                                        </div>
                                                                        <p className="text-sm text-slate-600">{claim.description}</p>
                                                                        <p className="text-xs text-slate-500 mt-1">{claim.model} �€¢ {new Date(claim.timestamp).toLocaleDateString()}{claim.userEmail && ` �€¢ ${claim.userEmail}`}</p>
                                                                    </div>
                                                                    <div className="text-right flex flex-col items-end gap-2">
                                                                        <div>
                                                                            <p className="text-xs text-slate-500">Hours</p>
                                                                            <p className="text-sm font-bold text-slate-800">
                                                                                {((claim.totalDiagnosticHours || 0) + (claim.totalRepairHours || 0)).toFixed(1)}h
                                                                            </p>
                                                                        </div>
                                                                        <button onClick={() => { if (confirm('Delete this claim?')) deleteClaim(claim.id); }} className="text-red-500 hover:text-red-700 p-1">
                                                                            <Icons.Trash className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                                    {claim.diagnosticOps?.length > 0 && (
                                                                        <div className="bg-blue-50 rounded p-2">
                                                                            <p className="text-xs font-semibold text-blue-700 mb-1">Diagnostic</p>
                                                                            {claim.diagnosticOps.map((op, idx) => (
                                                                                <div key={idx} className="text-xs">
                                                                                    <span className="font-mono">{op.opCode}</span> ({op.soldHours}h)
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {claim.repairOps?.length > 0 && (
                                                                        <div className="bg-green-50 rounded p-2">
                                                                            <p className="text-xs font-semibold text-green-700 mb-1">Repair</p>
                                                                            {claim.repairOps.map((op, idx) => (
                                                                                <div key={idx} className="text-xs">
                                                                                    <span className="font-mono">{op.opCode}</span> ({op.soldHours}h)
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {claim.mainPart && (
                                                                    <div className="mt-2 text-xs text-slate-600 bg-green-50 rounded px-2 py-1">
                                                                        <span className="font-semibold">Main Part:</span> {claim.mainPart.partNumber} - {claim.mainPart.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-slate-200 bg-slate-50 p-6 sticky bottom-0">
                                        <button onClick={() => setShowAnalyticsModal(false)} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg">Close</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        ReactDOM.render(<App />, document.getElementById('root'));
    