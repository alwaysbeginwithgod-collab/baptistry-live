// app/data/devotions.ts

export interface Devotion {
  id: string;
  title: string;
  tagline: string;
  scripture: string;
  content: string;
  prayer: string;
  image?: string;
  facebookLink?: string;
}

export const devotions: Devotion[] = [
  {
    id: 'Devotion-1',
    title: 'Ask and Receive',
    tagline: `✍️ "When every road is dark and you don't know the way, Ask God for wisdom—His light will guide the way."`,
    scripture: 'James 1:5 "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him"',
    content: `Life is full of crossroads. It often confronts us with decisions bigger than our understanding. We have all been there—staring at a decision that feels impossible. Should I stay or go? Speak or stay silent? Wait or move forward? Whether we are facing uncertainty, confusion, or a major decision, the question is not whether we need wisdom—but where we are seeking it.
    
James wrote to believers facing trials and pressures. God's answer was not merely strength to endure, but wisdom to navigate. Notice the promise: God does not withhold wisdom from His children who sincerely ask.

Wisdom is like a lamp carried through a dark path. It may not reveal the entire journey at once, but it provides enough light for the next faithful step. God often guides us this way—not by showing us everything ahead, but by giving us what we need for today.

Scripture points us to God's wisdom. "Trust in the LORD with all thine heart; and lean not unto thine own understanding" (Proverbs 3:5). Solomon asked for wisdom, and God generously gave it (1 Kings 3:9-12). God's wisdom is never separated from God's Word.

Many of us ask everyone except God. We consult opinions, trends, and endless advice, yet neglect the One who knows the end from the beginning. "The fear of the LORD is the beginning of wisdom" (Proverbs 9:10). Don't treat life like a maze while refusing the map. God does not promise to answer every curiosity, but He does promise wisdom for every step of obedience. He gives generously, not grudgingly, but liberally.

Christ Himself is the fullness of wisdom. "In whom are hid all the treasures of wisdom and knowledge" (Colossians 2:3). At the cross He revealed the wisdom of God that confounds the world. To walk with Christ is not only to receive forgiveness for our failures, but also the wisdom needed for faithful living.

What decision has been weighing heavily on your heart? Where have you been relying more on your own understanding than God's direction? You don't need Christ merely to help you make better choices—you need Him because He is Wisdom itself. Ask God today. The One who never errs delights to guide His children.`,
    prayer: `Heavenly Father, thank You that You never leave us to navigate life alone. We are grateful that You generously give wisdom to those who ask. Forgive us for trusting our own understanding more than Your wisdom. Teach us to seek You first, submit to Your Word, and depend upon Christ in every decision. Give us wisdom to walk faithfully and courage to obey what You reveal. In Jesus' Name. Amen.`,
    image: '/devotions/Devotion-1.jpg',
    facebookLink: 'https://www.facebook.com/BeginWithGod/'
  },

  {
    id: 'Devotion-2',
    title: 'Believe God Now',
    tagline: `✍️ "Without Faith we cannot please God. Without God we cannot have Faith."`,
    scripture: 'Hebrews 11:6 "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him."',
    content: `We fill our lives with religious activity—services attended, verses memorized, offerings given—yet quietly wonder why God feels distant. We perform without trusting, pray without believing, and serve while our hearts drift. God is not impressed by our busyness; He is moved by our belief. The question is not whether we are doing enough for God, but whether we actually believe He is who He says He is.

Hebrews 11:6 declares, "But without faith it is impossible to please him…" In a world full of rituals and routines, God sets the standard—faith, not form, pleases Him. "Impossible" means none of our best efforts can substitute for Faith. And Scripture reminds us that without God, it is impossible to have faith at all, for Christ is the "Author and Finisher of our faith" (Hebrews 12:2).

Faith is like stepping onto a bridge in thick fog. We do not see the end, yet we trust the One who built it. The heroes of Hebrews 11 walked not by sight, yet not without certainty. Faith does not rest in outcomes—it rests in the unchanging character of God.

Scripture testifies that faith is central to the Christian life. "For we walk by faith, not by sight" (2 Corinthians 5:7). "The just shall live by faith" (Romans 1:17). Faith is not blind hopefulness—it is bound in God's Word (Romans 10:17). Habakkuk 2:4 anchors it clearly: "The just shall live by his faith." Faith is not merely the doorway into the Christian life—it is the atmosphere in which we breathe.

Hebrews 11:6 calls for two settled convictions: that God is, and that He rewards those who seek Him. Like a child running in the right direction because his father said so—that is faith that pleases God. Not faith that has every answer, but faith that holds the right direction. We must not live like a spinning compass—claiming heaven while trusting earth. Faith is not blind—it sees the Father.

Christ Himself is the Author and Finisher of our faith (Hebrews 12:2). He pleased the Father perfectly, trusted fully, and His finished work on the cross secures salvation completely. He has accomplished what we never could—"that we might be made the righteousness of God in him" (2 Corinthians 5:21).

What is the one place where you are hesitating to trust God today? You cannot please Him by fear, delay, or self-reliance. You don't need Christ just to inspire your faith—you need Him to be your confidence. Will you believe God now, before anything changes, simply because He is worthy?`,
    prayer: `Heavenly Father, we have often wanted proof before trust. Forgive us. Teach us to believe You fully, even when we cannot see. Strengthen our faith through Your Word and anchor our hearts in Christ alone. Help us walk by faith and not by sight. In Jesus' Name. Amen.`,
    image: '/devotions/Devotion-2.jpg',
    facebookLink: 'https://www.facebook.com/BeginWithGod/'
  },
  // Add more devotions here
];