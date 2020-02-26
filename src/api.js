export default (pathname = '', method = 'GET', params = null) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (params) {
    config.body = JSON.stringify(params);
  } 

  return fetch(`https://jsonplaceholder.typicode.com/posts${pathname}`, config)
    .then(req => {
      if (req.status < 400) return req.json();
      else throw new Error('Failed to connect');
    });
}
