// app/lib/baptistDoctrine.ts

export const baptistDoctrineLibrary = {
  salvation: {
    title: "Salvation by Grace through Faith",
    summary: "Salvation is offered freely to all who accept Jesus Christ as Lord and Saviour.",
    bfmQuote: "Salvation involves the redemption of the whole man, and is offered freely to all who accept Jesus Christ as Lord and Saviour, who by His own blood obtained eternal redemption for the believer. (BFM 2000, IV)",
    theologianQuote: `"Justification is a forensic declaration of pardon, which Christ has won through His victory over sin, death, the law and the devil." - David S. Dockery`,
    scripture: ["John 3:16 (KJV)", "Ephesians 2:8-9 (KJV)", "Romans 10:9-10 (KJV)"]
  },
  scriptures: {
    title: "The Authority of the Bible",
    summary: "The Bible is the inspired, inerrant, and infallible Word of God, the final authority for faith and practice.",
    bfmQuote: "The Holy Bible was written by men divinely inspired and is God's revelation of Himself to man. It is a perfect treasure of divine instruction. (BFM 2000, I)",
    theologianQuote: `"Baptists have insisted that the Bible is the sole ultimate written authority for Christian faith and practice." - Baptist Distinctives`,
    scripture: ["2 Timothy 3:16-17 (KJV)", "2 Peter 1:20-21 (KJV)", "Psalm 119:105 (KJV)"]
  },
  god: {
    title: "The One True God",
    summary: "There is one and only one living and true God, existing in three Persons: Father, Son, and Holy Spirit.",
    bfmQuote: "There is one and only one living and true God. The eternal triune God reveals Himself to us as Father, Son, and Holy Spirit, with distinct personal attributes, but without division of nature, essence, or being. (BFM 2000, II)",
    theologianQuote: `"The doctrine of the Trinity is the distinctive Christian teaching about the nature of God." - Millard Erickson`,
    scripture: ["Deuteronomy 6:4 (KJV)", "Matthew 28:19 (KJV)", "John 1:1 (KJV)", "2 Corinthians 13:14 (KJV)"]
  },
  baptism: {
    title: "Believer's Baptism by Immersion",
    summary: "Baptism is an act of obedience symbolizing the believer's faith in a crucified, buried, and risen Saviour.",
    bfmQuote: "Christian baptism is the immersion of a believer in water in the name of the Father, Son, and Holy Spirit. It is an act of obedience symbolizing the believer's faith in a crucified, buried, and risen Saviour. (BFM 2000, VII)",
    theologianQuote: `"Baptism is the church's visible declaration of the gospel." - John Piper`,
    scripture: ["Matthew 28:19-20 (KJV)", "Acts 8:36-39 (KJV)", "Romans 6:3-4 (KJV)"]
  },
  church: {
    title: "The Local Church",
    summary: "A New Testament church is an autonomous local congregation of baptized believers.",
    bfmQuote: "A New Testament church of the Lord Jesus Christ is an autonomous local congregation of baptized believers, associated by covenant in the faith and fellowship of the gospel. (BFM 2000, VI)",
    theologianQuote: `"The church is a body of baptized believers, not a building or a denomination." - Baptist Distinctives`,
    scripture: ["Acts 2:41-47 (KJV)", "Ephesians 1:22-23 (KJV)", "1 Timothy 3:15 (KJV)"]
  },
  secondComing: {
    title: "The Second Coming of Christ",
    summary: "Jesus Christ will return personally and visibly to establish His kingdom.",
    bfmQuote: "God, in His own time and in His own way, will bring the world to its appropriate end. Jesus Christ will return personally and visibly. (BFM 2000, X)",
    theologianQuote: `"The blessed hope of the believer is the personal, pre-millennial, and imminent return of our Lord Jesus Christ." - Baptist Confession`,
    scripture: ["1 Thessalonians 4:16-17 (KJV)", "Titus 2:13 (KJV)", "Revelation 22:20 (KJV)"]
  }
};

// Helper function to get doctrine by keyword
export function getDoctrineByKeyword(query: string): typeof baptistDoctrineLibrary[keyof typeof baptistDoctrineLibrary] | null {
  const lowerQuery = query.toLowerCase();
  
  const keywordMap = {
    salvation: ['salvation', 'saved', 'save', 'born again', 'justified', 'redemption', 'forgiven', 'grace', 'faith'],
    scriptures: ['bible', 'scripture', 'word of god', 'kjv', 'king james', 'inspired', 'inerrancy', 'preserved'],
    god: ['god', 'trinity', 'father', 'son', 'holy spirit', 'godhead', 'divine'],
    baptism: ['baptism', 'baptize', 'immersion', 'believer baptism', 'ordinance'],
    church: ['church', 'local church', 'assembly', 'fellowship', 'body of christ', 'ecclesiology'],
    secondComing: ['second coming', 'rapture', 'return of christ', 'end times', 'eschatology', 'premillennial']
  };
  
  for (const [key, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        return baptistDoctrineLibrary[key as keyof typeof baptistDoctrineLibrary];
      }
    }
  }
  
  return null;
}