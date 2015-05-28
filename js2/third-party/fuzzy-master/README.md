# fuzzy

1k standalone fuzzy search / fuzzy filter a la Textmate and Sublime Text's command-T fuzzy file search. Node or browser.

## Get it

Node:

```bash
$ npm install fuzzy
$ node
> var fuzzy = require('fuzzy');
> console.log(fuzzy)
{ test: [Function],
  match: [Function],
  filter: [Function] }
```

Browser:

```html
<script src="/path/to/fuzzy.js"></script>
<script>
  console.log(fuzzy);
  // Object >
  //   filter: function (pattern, arr, opts) {
  //   match: function (pattern, string, opts) {
  //   test: function (pattern, string) {
</script>
```

## Use it

Padawan: Simply filter an array of strings.

```javascript
var list = ['baconing', 'narwhal', 'a mighty bear canoe'];
var results = fuzzy.filter('bcn', list)
var matches = results.map(function(el) { return el.string; });
console.log(matches);
// [ 'baconing', 'a mighty bear canoe' ]
```

Jedi: Wrap matching characters in each string

```javascript
var list = ['baconing', 'narwhal', 'a mighty bear canoe'];
var options = { pre: '<', post: '>' };
var results = fuzzy.filter('bcn', list, options)
console.log(results);
// [
//   {string: '<b>a<c>o<n>ing'           , index: 0, score: 3, original: 'baconing'},
//   {string: 'a mighty <b>ear <c>a<n>oe', index: 2, score: 3, original: 'a mighty bear canoe'}
// ]
```

Jedi Master: sometimes the array you give is not an array of strings. You can
pass in a function that creates the string to match against from each element
in the given array

```javascript
var list = [
    {rompalu: 'baconing', zibbity: 'simba'}
  , {rompalu: 'narwhal' , zibbity: 'mufasa'}
  , {rompalu: 'a mighty bear canoe', zibbity: 'saddam hussein'}
];
var options = {
    pre: '<'
  , post: '>'
  , extract: function(el) { return el.rompalu; }
};
var results = fuzzy.filter('bcn', list, options);
var matches = results.map(function(el) { return el.string; });
console.log(matches);
// [ '<b>a<c>o<n>ing', 'a mighty <b>ear <c>a<n>oe' ]
```

## Examples
Check out the html files in the examples directory

## Documentation
Code is well documented and the unit tests cover all functionality

## Contributing
Fork the repo!

    git clone <your_fork>
    cd fuzzy
    npm install -d
    make

Add unit tests for any new or changed functionality. Lint, test, and minify using make, then shoot me a pull request.

## Release History
v0.1.0 - July 25, 2012

## License
Copyright (c) 2015 Matt York
Licensed under the MIT license.

## TODO

1. Search improvement: behave a bit more like sublime text by getting
   the BEST match in a given string, not just the first. For example,
   searching for 'bass' in 'bodacious bass' should match against 'bass',
   but it currently matches like so: `<b>od<a>ciou<s> ba<s>s`. There is
   a test already written, just need to implement it. Naive O(n^2) worst
   case: find every match in the string, then select the highest scoring
   match. Should benchmark this against current implementation once implemented
   Also, "reactive rice" would be `<r><e>active r<i><c>e`
2. Search feature: Work on multiple strings in a match. For example, be able
   to match against 'stth' against an object { folder: 'stuff', file: 'thing' }
3. Async batch updates so the UI doesn't block for huge sets. Or maybe Web Workers?
4. Performance performance performance!
