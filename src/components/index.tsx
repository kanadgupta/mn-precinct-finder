import type { Props } from '../server.js';

import { html } from 'hono/html';
import { type FC } from 'hono/jsx';

const Layout: FC = ({ children }) =>
  html`<!DOCTYPE html>
    <html lang="en">
      ${children}
    </html>`;

const Page: FC<Props> = ({ seo, ...props }) => {
  const precinct = props.type === 'success' ? props.precinct : null;
  const pollingPlace = props.type === 'success' ? props.mplsPollingPlace21 : null;

  return (
    <Layout>
      <head>
        <meta charset="utf-8" />
        <link rel="icon" href="https://fav.farm/🗳️" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>{seo.title}</title>

        <link rel="canonical" href={seo.url} />
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={seo.url} />
        <meta property="og:description" content={seo.description} />
        <meta name="twitter:card" content="summary" />

        <style
          dangerouslySetInnerHTML={{
            __html: `@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap');`,
          }}
        />
        {/* Import the webpage's stylesheet */}
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        {/* <div class="notification-bar">
          Did you vote today?&nbsp;
          <a href="https://forms.gle/9EGD7oDasZAEmu38A" rel="noopener" target="_blank">
            Fill out our turnout tracker!
          </a>
        </div> */}
        <div class="wrapper">
          <div class="content" role="main">
            {/* This is the start of content for our page */}
            <h1 class="title">
              <a class="title" href="/">
                MPLS Poll Finder
              </a>
            </h1>
            {/* Add text indicating that we've found the precinct */}
            {props.type === 'success' && precinct ? (
              <>
                {pollingPlace ? (
                  <>
                    <p class="precinct-info">
                      The polling place for{' '}
                      <a href={props.gmaps} id="address" rel="noopener" target="_blank">
                        {props.address}
                      </a>{' '}
                      is...
                      <br />
                      <br />
                      🗳️{' '}
                      <b>
                        <a href={pollingPlace.gmapsUrl} id="mplsPollingPlace21" rel="noopener" target="_blank">
                          <span id="mplsPollingPlace21-name">{pollingPlace.building}</span> -{' '}
                          <span id="mplsPollingPlace21-address">{pollingPlace.address}</span>
                        </a>
                      </b>{' '}
                      🗳️
                      {pollingPlace.directions ? (
                        <>
                          <br />
                          <span class="directions precinct-info">
                            🚪 (<span id="mplsPollingPlace21-name">{pollingPlace.directions}</span>)
                          </span>
                        </>
                      ) : null}
                    </p>
                    <p class="precinct-info">Before you vote, it might be helpful to know your electoral districts:</p>
                  </>
                ) : (
                  <p class="precinct-info">
                    Hmm...{' '}
                    <b>
                      <a href="{{gmaps}}" rel="noopener" target="_blank">
                        {props.address}
                      </a>
                    </b>{' '}
                    doesn't appear to be in Minneapolis!
                    <br />
                    <br />
                    In any case, here's some info about your electoral boundaries!
                  </p>
                )}
                <ul class="precinct-info">
                  <li>
                    <b>Precinct:</b> <span id="Precinct">{precinct.Precinct}</span>
                  </li>
                  <li>
                    <b>Park Board District:</b> <span id="Park">{precinct.Park}</span>
                  </li>
                  <li class="extra hidden">
                    <b>U.S. Congressional District:</b> <span id="CongDist">{precinct.CongDist}</span>
                  </li>
                  <li class="extra hidden">
                    <b>County:</b> <span id="County">{precinct.County}</span>
                  </li>
                  <li class="extra hidden">
                    <b>County Commissioner District:</b> <span id="CtyComDist">{precinct.CtyComDist}</span>
                  </li>
                  <li class="extra hidden">
                    <b>State Senate District:</b> <span id="MNSenDist">{precinct.MNSenDist}</span>
                  </li>
                  <li class="extra hidden">
                    <b>State Legislative District:</b> <span id="MNLegDist">{precinct.MNLegDist}</span>
                  </li>
                  <li class="extra hidden">
                    <b>State Judicial District:</b> <span id="Judicial">{precinct.Judicial}</span>
                  </li>
                  <li class="extra hidden">
                    <b>Minor Civil Division (MCD):</b> <span id="MCDName">{precinct.MCDName}</span>
                  </li>
                  {/* hiding these properties since they're not useful at all in Minneapolis */}
                  {/* <li class="extra hidden">
                    <b>Soil and Water District:</b> <span id="SoilAndWater">{precinct.SoilAndWater}</span>
                  </li>
                  <li class="extra hidden">
                    <b>Hospital District:</b> <span id="Hospital">{precinct.Hospital}</span>
                  </li>
                  <li class="extra hidden">
                    <b>County ID:</b> <span id="CountyID">{precinct.CountyID}</span>
                  </li>
                  <li class="extra hidden">
                    <b>MCD Code:</b> <span id="MCDCode">{precinct.MCDCode}</span>
                  </li>
                  <li class="extra hidden">
                    <b>Precinct Code:</b> <span id="PrecinctCode">{precinct.PrecinctCode}</span>
                  </li> */}
                  <li>
                    <a aria-expanded="false" onclick="toggleInfo(event)" href="">
                      Show irrelevant info...
                    </a>
                  </li>
                </ul>
              </>
            ) : null}
            {/* Add text indicating that we've encountered an error */}
            {props.type === 'error' && props.error ? (
              <>
                <p class="precinct-info">
                  {/* The server script passes error if the user submission can't be matched */}
                  Hmm... <b>{props.error?.message}</b> {props.error?.suggestion || null}
                </p>
                {props.error?.addresses ? (
                  <>
                    {props.error?.addresses.map(address => (
                      <li>
                        <a href={address.href}>{address.text}</a>
                      </li>
                    ))}
                  </>
                ) : null}
              </>
            ) : null}
            {props.type === 'default' ? (
              <>
                <p class="intro subtitle">An open-source, API-backed poll finder that (mostly) doesn't suck ❤️</p>
                <p class="intro">
                  ⚠️ <a href="#faq">Check out the FAQ</a> before diving in!
                </p>
              </>
            ) : null}
            {props.type === 'default' || props.type === 'error' ? (
              <>
                {' '}
                <p class="intro">
                  👀 Need an example? <a href="?example=go">Click here!</a>
                </p>
              </>
            ) : null}
            <div class="form-wrapper">
              {/* Our default paragraph/message */}
              <form class="address-form" method="get">
                <label for="address-input">
                  <span class="subtitle">
                    {props.type === 'default' ? "What's your home address? 🏡" : "Let's try another address! 🏡"}
                  </span>
                  <br />
                  <input
                    id="address-input"
                    name="address"
                    required
                    placeholder="123 Main St, 55411"
                    type="text"
                    value={(props.type === 'error' && props.error?.query) || ''}
                  />
                </label>
                <button type="submit">Search</button>
              </form>
            </div>
            {/* FAQ */}
            <div class="faq-wrapper">
              <h2 id="faq">Frequently Asked Questions (F.A.Q.)</h2>
              <h3>What is this?</h3>
              <p>
                This is a tool that (mostly) helps you with one thing: finding your polling place (if you live in
                Minneapolis) and your voting precinct (if you live in Minnesota)!
              </p>
              <h3>Are there any limitations with this tool?</h3>
              <p>Yes. lol.</p>
              <p>
                First off, this relies on Google Maps for geocoding the data. Like most APIs, if you send garbage data
                to it, you'll likely receive garbage in return. In other words, you'll see the best results if you send
                complete street addresses (that actually exist!), with brownie points if you include a ZIP code.
              </p>
              <p>
                With any geocoder, the data tends to be less accurate in less populous areas. While it should work just
                fine for most parts of the state (provided you send it complete and valid addresses), take it with a
                grain of salt if you're outside of the Twin Cities Metro Area!{' '}
                <b>
                  If you're ever unsure of the results you're getting,{' '}
                  <a href="https://pollfinder.sos.state.mn.us/" rel="noopener" target="_blank">
                    the official poll finder
                  </a>{' '}
                  is your best bet.
                </b>
              </p>
              <h3>
                So this is cool and all but... the Minnesota Secretary of State{' '}
                <a href="https://pollfinder.sos.state.mn.us/" rel="noopener" target="_blank">
                  already does this
                </a>
                . Why are you?
              </h3>
              <p>
                It's true—the Secretary of State (SOS) has done excellent work on these fronts and it serves us very
                well! However, the current system requires <b>a lot</b> of clicks to access all of that valuable
                information—not just access to your precinct and its corresponding polling place, but all of your
                electoral boundaries (Ward, County, Congressional Districts, etc.) and everything on your ballot.
              </p>
              <p>
                And the bummer for developers like myself is that there's no discernable pattern to these URLs, meaning
                that all of this information is difficult to access at scale unless you cobble it together yourself.
                This makes it harder for grassroots campaigns with an essential part of their jobs, which has a
                downstream negative impact on electoral turnout.
              </p>
              <p>
                This tool isn't intended to replace the SOS's system—it was built by a single person with a literal $0
                budget, I honestly couldn't do that if I tried! This is more intended to be a exploration of what a
                modern electoral information API could like. 🌱
              </p>
              <h3>You mentioned that this is an API! How does that work?</h3>
              <p>
                You can retrieve a JSON representation of the data provided on the website by passing an{' '}
                <code>Accept</code> header in your request that specifies <code>application/json</code>. You can
                alternatively pass a <code>format=json</code> query parameter (
                <a href="/?example=go&format=json" rel="noopener" target="_blank">
                  like this!
                </a>
                ).
              </p>
              <p>
                The markup on this webpage also includes a few hidden tricks for Google Sheets users to easily integrate
                this data into their spreadsheets. You can grab the XPath selectors of certain fields on the page and
                then use formulas like these to import the data:
              </p>
              <ul>
                <li>
                  <code>=IMPORTXML("{seo.url}?address="&ENCODEURL("100 Main St"),"//*[@id='Precinct']")</code>
                </li>
                <li>
                  <code>=IMPORTXML("https://mpls.vote?address="&ENCODEURL("100 Main St"),"//*[@id='address']")</code>
                </li>
                <li>
                  <code>=IMPORTXML("{seo.url}?address="&ENCODEURL("100 Main St"),"//*[@id='mplsPollingPlace21']")</code>
                </li>
              </ul>
              <h3>Do you have a privacy policy?</h3>
              <p>
                This is a humble proof-of-concept so it doesn't have any official privacy policy legalese, but this
                website does not include with any client-side analytics/tracking scripts whatsoever, nor we store any of
                the information you send anywhere. The code is{' '}
                <a href="https://github.com/kanadgupta/mn-precinct-finder" rel="noopener" target="_blank">
                  fully open-source
                </a>{' '}
                if you'd like to verify this for yourself!
              </p>
              <p>
                The information you submit to the site via the query parameters (address information, geographic
                coordinates via the 'Current Location' button, etc.) is anonymously sent to the{' '}
                <a href="https://developers.google.com/maps/documentation/geocoding" rel="noopener" target="_blank">
                  Google Maps Geocoding API
                </a>{' '}
                so that information is subject to{' '}
                <a href="https://policies.google.com/privacy" rel="noopener" target="_blank">
                  their privacy policy
                </a>{' '}
                and{' '}
                <a href="https://policies.google.com/terms" rel="noopener" target="_blank">
                  their terms of use
                </a>
                . So don't, like, send your social security number through the form? It's totally invisible to us, but
                it's technically being sent to Google.
              </p>
              <h3>Will elections save us?</h3>
              <p>lol... you must be new here</p>
            </div>
          </div>
          <footer class="footer">
            <span>
              made with &hearts; by{' '}
              <a href="https://github.com/kanadgupta.com" rel="noopener" target="_blank">
                kanad
              </a>
            </span>
          </footer>
        </div>
        <script
          // This script is used to toggle the display of the extra information.
          // No need for a client side JS library!
          dangerouslySetInnerHTML={{
            __html: `
function toggleInfo(e) {
  e.preventDefault();
  // Toggle display of every hidden item
  document.querySelectorAll('li.extra').forEach(item => {
    item.classList.toggle('hidden');
  });
  // Update attributes on toggle element
  const isHidden = document.querySelector('li.extra').classList.contains('hidden');
  e.target.innerText = isHidden ? 'Show irrelevant info...' : 'Hide irrelevant info...';
  e.target.setAttribute('aria-expanded', !isHidden);
}`,
          }}
        ></script>
      </body>
    </Layout>
  );
};

export default Page;
