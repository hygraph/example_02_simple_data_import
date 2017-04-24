import { Lokka } from 'lokka';
import { Transport } from 'lokka-transport-http';

// ensure timezone is set to UTC:
process.env.TZ = 'UTC'


// Replace the placeholder $PROJECTID_OR_ALIAS$ by your project id or project alias:
const client = new Lokka({
  transport: new Transport('https://api.graphcms.com/simple/v1/$PROJECTID_OR_ALIAS$'),
});

const createEvent = async ({ date, description, event, link, location, speakers, title }) => {
  const mutationResult = await client.mutate(`{
    event: createEvent(
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
  }`);
  return mutationResult.event.id;
};

const startImport = async () => {
  const data = require('../data.json');

  console.log(`Start to import ${data.length} entries`);

  const eventIds = await Promise.all(data.map(createEvent));

  console.log(`Finished creating ${eventIds.length} events. Ids:`, eventIds);
};

startImport().catch((err) => console.error('Error while importing data', err));
