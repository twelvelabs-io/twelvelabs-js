import { TwelveLabs } from 'twelvelabs';

const CLASSES = [
  {
    name: 'Cartoon',
    prompts: [
      'A cartoon is being drawn on paper.',
      'A cartoon is being animated on a computer.',
      'The characters speak in exaggerated, cartoonish voices or accents.',
      'Characters have exaggerated physical features, such as oversized heads, eyes',
    ],
  },
  {
    name: 'Video game',
    prompts: [
      'A person is playing a video game on a console.',
      'A person is controlling an avatar in a virtual world.',
      'A character is jumping over obstacles in a game.',
      'video game',
    ],
  },
  {
    name: 'Music video',
    prompts: [
      'A singer is performing on stage.',
      'A band is playing their instruments.',
      'A music video is playing on a screen.',
      'A group of dancers are performing a routine.',
      'An idol is dancing and singing',
    ],
  },
  {
    name: 'Vlog',
    prompts: [
      'A video is being recorded on a camera.',
      'Outdoor recreation',
      'A person is walking and chilling outside',
      'Travel video',
      'A vlogger is showing their daily routine.',
    ],
  },
  {
    name: 'Transportation',
    prompts: [
      'A train is leaving the station.',
      'A bus is driving on the highway.',
      'A plane is taking off from the airport.',
      'Vehicle',
      'Riding a bike',
    ],
  },
  {
    name: 'Lecture',
    prompts: [
      'A student is raising their hand to ask a question.',
      'A slideshow is being presented in a classroom.',
      'The teacher is writing on the whiteboard.',
      'professor is giving a speech to a group of student',
      'lecture',
      'presenting in front of an audience',
    ],
  },
  {
    name: 'Sports',
    prompts: [
      'A person is playing a sport.',
      'A team is competing in a game.',
      'Spectators are cheering at the stadium.',
      'Competitive physical activity',
      'Athletes are practicing on a field.',
    ],
  },
  {
    name: 'News',
    prompts: [
      'A news anchor is delivering a report.',
      'A group of journalists are discussing a story.',
      'A camera crew is filming an interview.',
      'A reporter is standing in front of a crowd.',
    ],
  },
  {
    name: 'Animal',
    prompts: ['People with pets', 'dog', 'cat', 'pets', 'bird', 'fish'],
  },
  {
    name: 'Cover Song',
    prompts: [
      'A band is singing a rendition of a classic song.',
      'A person is playing guitar',
      'A person is playing a song',
      'musician is playing different version of popular song',
    ],
  },
];

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.API_KEY });

  const index = await client.index.retrieve('<YOUR_INDEX_ID>');
  const videos = await client.index.video.list(index.id);
  if (videos.length === 0) {
    throw new Error(`No videos in index ${index.id}, exit`);
  }
  const videoIds = videos.map(({ id }) => id);

  console.log('Classify by index');
  const resultIndex = await client.classify.index({
    indexId: index.id,
    options: ['visual', 'conversation'],
    classes: CLASSES,
  });

  resultIndex.data.forEach((data) => {
    console.log(`video_id=${data.videoId}`);
    data.classes.forEach((cl) => {
      console.log(`  name=${cl.name} score=${cl.score} durationRatio=${cl.durationRatio}`);
    });
  });

  console.log('Classify by videos');
  const resultVideos = await client.classify.videos({
    videoIds: videoIds,
    options: ['visual', 'conversation'],
    classes: CLASSES,
  });

  resultVideos.data.forEach((data) => {
    console.log(`video_id=${data.videoId}`);
    data.classes.forEach((cl) => {
      console.log(`  name=${cl.name} score=${cl.score} durationRatio=${cl.durationRatio}`);
    });
  });
})();
