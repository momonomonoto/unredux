import * as R from "@paqmind/ramda"
import {connect, derive, isolate} from "framework"
import K from "kefir"
import * as D from "kefir.db"
import React from "react"
import U from "urlz"
import router from "../router"

// SEED
export let seed = {
  url: document.location.pathname,
  // page1, page2 use their own states (for the sake of demonstration)
  page3: 0,
}

export default (sources, key) => {
  let url$ = derive(sources.state$, ["url"])

  // ROUTING
  let contentSinks$ = url$
    .filter(Boolean)
    .map(url => {
      let {mask, params, payload: app} = router.doroute(url)
      app = isolate(app, key + mask, ["DOM", "Component"])
      let sinks = app({...sources, props: {mask, params, router}})
      return R.merge({action$: K.never()}, sinks)
    })

  // INTENTS
  let intents = {
    navigateTo$: sources.DOM.from("a").listen("click")
      .filter(ee => !ee.element.dataset.ui) // skip <a data-ui .../> links
      .flatMapConcat(ee => {
        let urlObj = U.parse(ee.element.href)
        if (urlObj.protocol && urlObj.host != document.location.host) {
          // External link
          console.log("! external link")
          return K.never()
        }
        else if (ee.event.shiftKey || navigator.platform.match("Mac") ? ee.event.metaKey : ee.event.ctrlKey) {
          // Holding Shift or Ctrl/Cmd
          console.log("! new tab/window")
          return K.never()
        }
        else {
          // Internal link
          if (urlObj.pathname == document.location.pathname && urlObj.hash) {
            // Anchor link
            console.log("! anchor link")
            // do nothing, rely on default browser behavior
          } else {
            // Page link or Reset-Anchor link (foo#hash -> foo)
            console.log("! page link")
            ee.event.preventDefault() // take control of browser
            window.scrollTo(0, 0)     //
          }
          window.history.pushState({}, "", urlObj.relHref)
          return K.constant(urlObj.relHref)
        }
      }),

    navigateHistory$: K.fromEvents(window, "popstate")
      .map(data => U.relHref(document.location.href)), // TODO scroll to hash (how?!)
  }

  // STATE
  let state$ = D.run(
    () => D.makeStore({}),
    // D.withLog({key}),
  )(
    // Init
    D.init(seed),

    // Navigation
    intents.navigateTo$.map(url => R.fn("navigateTo", R.set2("url", url))),
    intents.navigateHistory$.map(url => R.fn("navigateHistory", R.set2("url", url))),

    // Content
    contentSinks$.flatMapLatest(x => x.action$),
  ).$

  // COMPONENT
  let Component = connect(
    {
      url: derive(state$, ["url"]),
      Content: contentSinks$.map(x => x.Component),
    },
    ({url, Content}) => {
      return <div>
        <p>
          Current URL: {url}
        </p>
        <p>
          <a href="/">Home</a>
          {" "}
          <a href="/page1#foo">Page 1</a>
          {" "}
          <a href="/page2?x=X">Page 2</a>
          {" "}
          <a href="/page3?x=X#foo">Page 3</a>
          {" "}
          <a href="https://github.com">GitHub.com</a>
          {" "}
          <a href="/not-found">Not Found</a>
        </p>
        <hr/>
        <Content/>
      </div>
    }
  )

  return {state$, Component}
}
