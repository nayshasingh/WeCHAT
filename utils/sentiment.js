/*
const messages = [
    `I hate you`,
    'I feel frustrated and disappointed. with the recent update.',
    'i love you',
  ];
  messages.forEach((message) => {
    const result = sentiment.analyze(message);
    console.log('Message:', message);
    console.log('Sentiment Score:', result.score);
    console.log('Comparative Sentiment:', result.comparative);
    console.log('----');
  });
  
*/
function message_sentiment(score)
{
    if(score>0)
        return 'green';
    else if(score<0)
        return 'red';
    else
        return 'yellow';
}
module.exports={
  message_sentiment
}