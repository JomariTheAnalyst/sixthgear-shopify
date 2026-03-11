import { getHomepageHero } from './src/lib/cms/client';

async function test() {
  const result = await getHomepageHero();
  console.log("TEST RESULT:", JSON.stringify(result, null, 2));
}

test();
