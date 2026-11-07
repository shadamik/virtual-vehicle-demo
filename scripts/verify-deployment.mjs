const base = process.env.BASE_URL.replace(/\/+$/, '') + '/';
const expected = process.env.SOURCE_SHA;
for(let attempt=0;attempt<24;attempt++){
  try {
    const response=await fetch(`${base}deployment.json?run=${process.env.GITHUB_RUN_ID || 'local'}&attempt=${attempt}`,{signal:AbortSignal.timeout(10000)});
    if(response.ok && (await response.json()).sha===expected){console.log(`Verified live commit ${expected} at ${base}`);process.exit(0);}
  } catch(error){console.log(error.message);}
  await new Promise(resolve=>setTimeout(resolve,5000));
}
throw new Error('Live deployment does not match tested commit');
