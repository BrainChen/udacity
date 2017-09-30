HTML part
=========
This period may construct frameworks in the body and can see the least codes there. For the purpose I want to use js files to operate DOM tree.

Javascript part
=============
This period may be a little complex, I use **jQuery**, **knockout** to simplify the develop process and using **MVVM model** in the whole js file.

process
=============
Well, step by step, I think I solved some difficult problems at different period and feel very proud of myself^_^
>- using google map api to locate the 7 places and add them to model object.
>- initializing the map function so it can render as soon as the page ready.
>- creating some functions like _addMarker()_, _moveMarker()_ so it can respond to the click events.
>- imitating a classic style of google maps code so the map looks beautiful
>- using knockout.js at the same time to process viewmodel.
>-add wikipedia api and baidu api to show more details about the places when click them.

### how to use it
>- you may just open it and type some information in the input you can see some of them are changed in time
>- click the marks or information items you can see some detail information about these places in my city
>- there are also have wikipedia link and you can search for authentic information about many things

### some problems when coding
>- abuse of _this_ (a terrible experience...and still remain some little trouble)
>- realizing google markers are not simply javascript objects... (I can not add functions to them...)
>- the function _setTimeout_ and finally realize I must encapsulate it in anonymous functions...
>**And at last I solved them :)**