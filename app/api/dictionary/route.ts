import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Webster's 1828 Dictionary data
const dictionaryData: Record<string, { word: string; definition: string; source: string }> = {
  calvary: {
    word: "CALVARY",
    definition: "1. A place of skulls; particularly, the place where Christ was crucified, on a small hill west of Jerusalem.\n\n2. In heraldry, a cross so called, set upon steps, resembling the cross on which our Savior was crucified.",
    source: "Webster's Dictionary 1828"
  },
  grace: {
    word: "GRACE",
    definition: "1. Favor; good will; kindness; disposition to oblige another.\n\n2. Appropriately, the free unmerited love and favor of God, the spring and source of all the benefits men receive from him.\n\n3. Favorable influence of God; divine influence or the influence of the spirit, in renewing the heart and restraining from sin.\n\n4. The application of Christ's righteousness to the sinner.\n\n5. A state of reconciliation to God.",
    source: "Webster's Dictionary 1828"
  },
  faith: {
    word: "FAITH",
    definition: "1. Belief; the assent of the mind to the truth of what is declared by another, resting on his authority and veracity.\n\n2. In theology, the assent of the mind or understanding to the truth of the divine word, and the plan of salvation.\n\n3. Evangelical, justifying faith, which is a firm belief of the gospel, accompanied with a cordial assent to its statements, and a sincere reception of Christ as the Savior.",
    source: "Webster's Dictionary 1828"
  },
  death: {
    word: "DEATH",
    definition: "1. That state of a being in which there is a total and permanent cessation of all the vital functions.\n\n2. The state of the dead.\n\n3. The manner of dying.\n\n4. The image of mortality represented by a skeleton.\n\n5. Murder; as a man of death.\n\n6. Cause of death.\n\n7. Destroyer or agent of death.\n\n8. In theology, perpetual separation from God, and eternal torments; called the second death.",
    source: "Webster's Dictionary 1828"
  },
  life: {
    word: "LIFE",
    definition: "1. That state of animals and plants in which their natural functions and motions are performed.\n\n2. In animals, animation; vitality; the state in which the soul and body are united.\n\n3. In plants, the state in which they grow or are capable of growth.\n\n4. The present state of existence; the time from birth to death.\n\n5. Manner of living; conduct.\n\n6. Condition; course of living.\n\n7. Blood, the supposed vehicle of animation.\n\n8. Animals in general.\n\n9. Spirit; animation; briskness.\n\n10. Eternal happiness in heaven.",
    source: "Webster's Dictionary 1828"
  },
  quickened: {
    word: "QUICKENED",
    definition: "1. Made alive; revived; vivified; reinvigorated.\n\n2. Accelerated; hastened.\n\n3. Stimulated; incited.",
    source: "Webster's Dictionary 1828"
  },
  love: {
    word: "LOVE",
    definition: "1. In a general sense to be pleased with; to regard with affection, on account of some qualities which please or delight.\n\n2. In theology, the love of God is the virtue by which a Christian loves God with all his heart, mind, soul, and strength, and his neighbor as himself.",
    source: "Webster's Dictionary 1828"
  },
  hope: {
    word: "HOPE",
    definition: "1. A desire of some good, accompanied with at least a slight expectation of obtaining it, or a belief that it is obtainable.\n\n2. Confidence in a future event; the highest degree of well-founded expectation of good; as a hope founded on God's gracious promises.",
    source: "Webster's Dictionary 1828"
  },
  sin: {
    word: "SIN",
    definition: "1. The voluntary departure of a moral agent from a known rule of rectitude or duty, prescribed by God; any voluntary transgression of the divine law, or violation of a divine command.\n\n2. The nature of sin consists in an opposition to the divine law, or a want of conformity to it.",
    source: "Webster's Dictionary 1828"
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');
  
  if (!word) {
    return NextResponse.json({ error: 'No word provided' }, { status: 400 });
  }
  
  const lowerWord = word.toLowerCase();
  const entry = dictionaryData[lowerWord];
  
  if (entry) {
    return NextResponse.json(entry);
  } else {
    return NextResponse.json({ 
      error: 'Word not found',
      message: `"${word}" not found in Webster's 1828 Dictionary. Try searching online at https://webstersdictionary1828.com/Dictionary/${word}`
    }, { status: 404 });
  }
}