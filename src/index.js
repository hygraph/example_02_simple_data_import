import { Lokka } from 'lokka';
import { Transport } from 'lokka-transport-http';

// ensure timezon is set to UTC:
process.env.TZ = 'UTC'


// Replace the placeholder $PROJECTID_OR_ALIAS$ by your project id or project alias:
const client = new Lokka({
  transport: new Transport('https://api.graphcms.com/simple/v1/$PROJECTID_OR_ALIAS$'),
});

const createEventMutation = ({ date, description, event, link, location, speakers, title }) => `
  createEvent(
    date: "${new Date(Date.parse(date)).toISOString()}"
    description: "${description}"
    event: "${event}"
    isPublished: true
    link: "${link}"
    location: "${JSON.stringify(location).replace(/\"/g, '\\"')}"
    speakers: ${JSON.stringify(speakers)}
    title: "${title}"
  ) {
    id
  }
`;


const startImport = async () => {
  const data = require('../data.json');

  console.log(`Start to import ${data.length} entries`);

  // create a mutation for every event and assign it to an alias:
  const mutations = data.map((event, index) => `mutation_${index}: ${createEventMutation(event)}`);

  const mutationString = `{
    ${mutations.join(' ')}
  }`;

  const results = await client.mutate(mutationString);
  console.log(`Finished creating ${Object.keys(results).length} events`, results);
};

startImport().catch((err) => console.error('Error while importing data', err));
