// app/lib/dailyEncouragements.ts

export const dailyEncouragements = [
  // Your messages
  { message: "Trust in the Lord with all thine heart today." },
  { message: "Be strong in the Lord, and His mighty power." },
  { message: "Thy word is a lamp unto my feet." },
  { message: "Commit thy works unto the Lord this day." },
  { message: "The Lord is my shepherd; I shall not want." },
  { message: "Be of good courage; He shall strengthen thee." },
  { message: "Rejoice in the Lord alway, and fear not." },
  { message: "Lean not unto thine own understanding this day." },
  { message: "Let your light so shine before men today." },
  { message: "The Lord is faithful; He shall stablish you." },
  { message: "Cast all your care upon Him right now." },
  { message: "I can do all things through Christ today." },
  { message: "The peace of God shall keep your heart." },
  { message: "Fear thou not; for I am with thee." },
  { message: "Walk in the Spirit, and fulfill His will." },
  { message: "Blessed is the man that trusteth in Him." },
  { message: "Hold fast that which is good this day." },
  { message: "Serve the Lord with gladness in your heart." },
  { message: "His compassions fail not; they are new today." },
  { message: "Set your affection on things above right now." },
  { message: "Walk by faith today; His grace is sufficient." },
  { message: "Without Faith, it is impossible to please God." },
  { message: "Without God, it is impossible to have faith." },
  
  // Additional encouraging messages
  { message: "Start your day with God. He is already there." },
  { message: "You are not alone. The Saviour walks with you." },
  { message: "Be still and know that He is God." },
  { message: "His mercies are new every morning. Great is His faithfulness." },
  { message: "Do not be anxious. Pray about everything." },
  { message: "Your weakness is God's opportunity to show His strength." },
  { message: "Today is a gift from God. Use it for His glory." },
  { message: "God's love for you never fails. Never." },
  { message: "You are a child of God. Live like it today." },
  { message: "Pray without ceasing. God is listening." },
  { message: "Let the peace of Christ rule in your heart." },
  { message: "Whatever you do, do it heartily as for the Lord." },
  { message: "Be kind to one another. You never know their battle." },
  { message: "Forgive as the Lord forgave you." },
  { message: "Put on the full armor of God for today's battle." },
];

export function getDailyEncouragement() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / 86400000);
  const index = dayOfYear % dailyEncouragements.length;
  return dailyEncouragements[index];
}