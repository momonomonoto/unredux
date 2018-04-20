import React from "react"

export default function Home(props) {
  return <div>
    <a href="/">/</a><br/>
    <a href="/#foo">/#foo</a><br/>
    <a href="/#bar">/#bar</a><br/>
    <a href="/?x=1#bar">/?x=1#bar</a><br/>
    <a href="/?x=1#foo">/?x=1#foo</a><br/>
    <a href="/?x=2#bar">/?x=2#bar</a><br/>
    <a href="/?x=2#foo">/?x=2#foo</a><br/>
    <p>
      The beginning...
    </p>
    <pre dangerouslySetInnerHTML={{__html: `
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
    `}}></pre>
    <h4 id="foo">Foo</h4>
    <pre dangerouslySetInnerHTML={{__html: `
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
    `}}></pre>
    <h4 id="bar">Bar</h4>
    <pre dangerouslySetInnerHTML={{__html: `
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
    `}}></pre>
  </div>
}
