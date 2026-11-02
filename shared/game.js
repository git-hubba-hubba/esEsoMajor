import {saveFeatureSetting,saveExperience,completePayment} from './demo-actions.js';
export const worlds=[
  {
    "id": "account-management",
    "name": "Account Foundations",
    "subtitle": "Establish your account structure",
    "x": 18,
    "y": 55,
    "color": "#9bceb2",
    "icon": "home",
    "quest": "Configure household access",
    "intro": "Start by organizing your household account. Give Alex, Jamie, and Taylor individual hubs with clearly defined access.",
    "clue": "Alex manages the account. Jamie and Taylor keep their own preferences and privacy.",
    "question": "Which account structure supports individual preferences and shared services?",
    "choices": [
      "Individual hubs, one shared account",
      "One shared profile for everyone"
    ],
    "correct": 0,
    "win": "Household access is configured. Each member has an individual hub, and Alex retains account ownership.",
    "feature": "account-07"
  },
  {
    "id": "billing-payments",
    "name": "Billing & Payments",
    "subtitle": "Understand and manage your balance",
    "x": 34,
    "y": 72,
    "color": "#f1ca7d",
    "icon": "coin",
    "quest": "Review your statement and payment",
    "intro": "Your monthly statement increased from $149 to $164. Review the charges to understand the difference before confirming a demo payment.",
    "clue": "The statement shows $99 wireless, $50 fiber, and a $15 protection add-on added October 13.",
    "question": "What explains the extra $15?",
    "choices": [
      "A new protection add-on",
      "An internet speed upgrade"
    ],
    "correct": 0,
    "win": "Statement reviewed and demo payment completed. Any eligible payment credits have been added to your balance.",
    "feature": "billing-06"
  },
  {
    "id": "wireless-services",
    "name": "Wireless Configuration",
    "subtitle": "Align your plan with your needs",
    "x": 47,
    "y": 48,
    "color": "#c0b0ef",
    "icon": "signal",
    "quest": "Configure international connectivity",
    "intro": "Jamie is traveling to London. Select a wireless configuration that supports the trip within the household’s monthly budget.",
    "clue": "Three lines cost $99. Protection is $15, fiber is $50, and a demo travel add-on is $10. Your budget is $180.",
    "question": "Which setup fits the trip and the budget?",
    "choices": [
      "Keep protection and add travel · $174",
      "Add a fourth line and travel · $207"
    ],
    "correct": 0,
    "win": "Your international configuration is saved at $174 per month, $6 below the planned budget.",
    "feature": "wireless-05"
  },
  {
    "id": "device-management",
    "name": "Device Management",
    "subtitle": "Organize your connected devices",
    "x": 16,
    "y": 25,
    "color": "#accb82",
    "icon": "device",
    "quest": "Assign a shared device profile",
    "intro": "Assign the shared iPad to the appropriate profile so household devices are organized consistently.",
    "clue": "Alex has an iPhone and watch. Jamie has a Galaxy. Taylor has an iPhone. The iPad is for everyone.",
    "question": "Which profile should the shared iPad join?",
    "choices": [
      "Household",
      "Alex only"
    ],
    "correct": 0,
    "win": "The shared iPad is assigned to the Household profile.",
    "feature": "device-07"
  },
  {
    "id": "usage-monitoring",
    "name": "Usage Insights",
    "subtitle": "Monitor consumption and set preferences",
    "x": 34,
    "y": 16,
    "color": "#83cdd9",
    "icon": "water",
    "quest": "Set a relevant usage notification",
    "intro": "Review your household’s current data consumption and choose a useful notification threshold.",
    "clue": "Alex used 18.4 GB, Jamie used 12.1 GB, and Taylor used 26.7 GB. The plan is unlimited.",
    "question": "Which threshold provides a timely notification above current usage?",
    "choices": [
      "75 GB · above the current 57.2 GB",
      "25 GB · already passed"
    ],
    "correct": 0,
    "win": "The 75 GB usage notification is configured. Your demo unlimited plan has no overage charges.",
    "feature": "usage-06"
  },
  {
    "id": "home-internet",
    "name": "Home Connectivity",
    "subtitle": "Manage your home network",
    "x": 64,
    "y": 24,
    "color": "#8bc6ad",
    "icon": "wifi",
    "quest": "Configure scheduled internet access",
    "intro": "Set a school-night schedule for the shared iPad while keeping personal phones available.",
    "clue": "The household wants the shared iPad to rest from 9 PM to 7 AM on school nights. Personal phones stay available.",
    "question": "Which setting fits your household?",
    "choices": [
      "School-night downtime for the shared iPad",
      "Pause every personal phone all day"
    ],
    "correct": 0,
    "win": "The shared iPad’s school-night downtime is configured for 9 PM–7 AM.",
    "feature": "internet-08"
  },
  {
    "id": "security-privacy",
    "name": "Security & Privacy",
    "subtitle": "Strengthen account protection",
    "x": 70,
    "y": 53,
    "color": "#b7c6ed",
    "icon": "shield",
    "quest": "Enable account change protection",
    "intro": "Spam protection has blocked 38 calls this month. Review an additional control for sensitive account changes.",
    "clue": "Wireless Account Lock helps restrict sensitive account changes. It is currently unlocked in your demo.",
    "question": "Which action strengthens protection for sensitive account changes?",
    "choices": [
      "Enable Wireless Account Lock",
      "Disable spam protection"
    ],
    "correct": 0,
    "win": "Wireless Account Lock is enabled in your demo configuration.",
    "feature": "security-06"
  },
  {
    "id": "family-controls",
    "name": "Household & Location",
    "subtitle": "Manage sharing with individual consent",
    "x": 54,
    "y": 78,
    "color": "#e5b5c6",
    "icon": "people",
    "quest": "Review location-sharing permissions",
    "intro": "Alex and Jamie have opted into location sharing. Taylor has chosen to keep their location private.",
    "clue": "Each person controls their own location sharing in their individual hub. All locations in this world are synthetic.",
    "question": "How should Taylor’s location-sharing preference be managed?",
    "choices": [
      "Let Taylor choose in their own hub",
      "Turn on Taylor’s sharing for them"
    ],
    "correct": 0,
    "win": "Individual consent is preserved. Taylor’s sharing preference remains under their control.",
    "feature": "family-05"
  },
  {
    "id": "shopping-upgrades",
    "name": "Device Upgrades",
    "subtitle": "Evaluate your next device",
    "x": 86,
    "y": 74,
    "color": "#eab28e",
    "icon": "shop",
    "quest": "Prepare a device upgrade request",
    "intro": "Jamie’s Galaxy is eligible for an upgrade. Review the available device and save a draft order before committing.",
    "clue": "A Apple iPhone 17 costs an illustrative $929.99. You can save a draft order and review it later.",
    "question": "What is the best next step?",
    "choices": [
      "Save a draft order for review",
      "Place a real purchase immediately"
    ],
    "correct": 0,
    "win": "A demo device order draft is saved for review. No purchase has been made.",
    "feature": "shopping-07"
  },
  {
    "id": "ai-support",
    "name": "Guided Support",
    "subtitle": "Get contextual account assistance",
    "x": 86,
    "y": 34,
    "color": "#cbb8ec",
    "icon": "star",
    "quest": "Resolve a billing question",
    "intro": "Use contextual guidance to understand your statement and identify the appropriate next step.",
    "clue": "Your agent knows the demo statement: $99 wireless + $15 protection + $50 fiber. LiveAvatar narration starts only on request.",
    "question": "Which question gives the guide something useful to work with?",
    "choices": [
      "Why did my bill increase by $15?",
      "Change everything without asking me"
    ],
    "correct": 0,
    "win": "Billing explanation reviewed: the protection add-on accounts for the $15 increase. Additional guidance remains available.",
    "feature": "support-02"
  },
  {
    "id": "notifications-status",
    "name": "Alerts & Notifications",
    "subtitle": "Choose relevant account updates",
    "x": 8,
    "y": 79,
    "color": "#edce8a",
    "icon": "bell",
    "quest": "Configure essential notifications",
    "intro": "Select notification preferences for billing, device upgrades, and service status.",
    "clue": "Your demo includes a bill reminder, an upgrade notice, and service updates. Essential alerts keep important information visible.",
    "question": "Which preference prioritizes important account updates?",
    "choices": [
      "Essential alerts",
      "Turn every alert off"
    ],
    "correct": 0,
    "win": "Essential account notifications are configured.",
    "feature": "notification-03"
  }
];
// Reveal a contiguous trail: completed islands plus exactly one new destination.
export function revealedWorlds(state){const claimed=new Set(state.game?.claimed||[]);const next=worlds.findIndex(w=>!claimed.has(w.id));return worlds.slice(0,next<0?worlds.length:next+1);}
export function canVisitWorld(state,id){return revealedWorlds(state).some(w=>w.id===id);}
export function nextWorld(state){return revealedWorlds(state).find(w=>!state.game?.claimed?.includes(w.id))||null;}
export function questReward(state,id){if(state.game?.claimed?.includes(id))return 0;if(id==='billing-payments')return state.paid?0:250;if(id==='wireless-services')return state.plans[id]?0:150;return 100;}
export function completeQuest(state,id){const world=worlds.find(w=>w.id===id);if(!world)throw Error('Unknown world');if(!canVisitWorld(state,id))throw Error('Complete the current island quest to reveal this destination');if(state.game?.claimed?.includes(id))return state;const reward=questReward(state,id);let next=state;
 switch(id){case 'billing-payments':next=completePayment(next);break;case 'wireless-services':next=saveExperience(next,id,{lines:3,budget:180,protection:true,travel:true,estimatedMonthly:174,settings:{'wireless-04':'Protection + travel','wireless-05':'Add travel preference'}});break;case 'device-management':next=saveFeatureSetting(next,'device-07','Household');break;case 'usage-monitoring':next=saveFeatureSetting(next,'usage-06','75 GB');break;case 'home-internet':next=saveFeatureSetting(next,'internet-08','9 PM – 7 AM');break;case 'security-privacy':next=saveFeatureSetting(next,'security-06','Locked');break;case 'shopping-upgrades':next=saveFeatureSetting(next,'shopping-07','Save draft order');break;case 'notifications-status':next=saveFeatureSetting(next,'notification-03','Essential alerts');break;}
 // Payment and first-time builders award credits in the existing account actions.
 const alreadyAwarded=next.credits-state.credits;return {...next,credits:next.credits+Math.max(0,reward-alreadyAwarded),completed:[...new Set([...next.completed,world.feature])],game:{...next.game,xp:(next.game?.xp||0)+100,claimed:[...(next.game?.claimed||[]),id]}};
}
