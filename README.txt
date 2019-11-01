This is a resumption of my work on jsScheme in 2009.
I'm not sure what state it is in, even though I recently (as of
30 Oct, 2019) copied it from ~tom2/Sites/dev/zen/_very_old on
my computer. There is probably a better, more recent clean up
of jsScheme in ~tom2/Sites/dev/_on-github/zen-continuations .
I did a lot of work on cleaning up jsScheme/js/jsScheme.js in
that directory.

The core of Zen is a tiny bit of Scheme code that will allow me to
create an environment that pauses and saves program state. Since
Zen runs in JavaScript, 'pausing' means 'not executing'. Simply,
a Zen program starts after the page is loaded and executes until
all the initial handler functions are installed and enabled.

What I want to end up with is a program that looks like this:

  (with-click-handlers 'block-1' 'block-2'
    (define mouse-input-1 (get-mouse-input 'block-1'))
    (define mouse-input-2 (get-mouse-input 'block-2')))

When run, the program should add on-click handlers to HTML elements
with IDs 'block-1' and 'block-2'; pause while getting mouse-input-1;
continue when the user clicks on the HTML element with id 'block-1';
pause while getting mouse-input-2; continue when the user clicks on
the element with id 'block-2'; then remove the on-click handlers.

-Tom Elam
