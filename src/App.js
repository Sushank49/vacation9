import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFact] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [curCategory, setCurCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (curCategory !== "all") {
          query = query.eq("category", curCategory);
        }

        const { data: facts, error } = await query
          .order("votesInteresting", {
            ascending: false,
          })
          .limit(1000);

        if (!error) setFact(facts);
        else alert("Error Fetching Data. Please reload the page.  ");
        setIsLoading(false);
      }
      getFacts();
    },
    [curCategory]
  );

  return (
    <>
      <Header setShowForm={setShowForm} showForm={showForm}></Header>
      {showForm ? (
        <NewFactForm setFact={setFact} setShowForm={setShowForm}></NewFactForm>
      ) : null}

      <main className="main">
        <CategoryFilter setCurCategory={setCurCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFact={setFact} />}
      </main>

      <p className="copyright">
        Created by{" "}
        <a
          href="https://www.github.com/Sushank49"
          className="link"
          target="_blank"
        >
          Sushank
        </a>
        . Idea By Jonas.
      </p>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ setShowForm, showForm }) {
  {
    /* HEADER */
  }
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Today I Learned Logo" />
        <h1>Today I Learned</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        onClick={() => (!showForm ? setShowForm(true) : setShowForm(false))}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFact, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCat] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e) {
    // 1 Prevent browser reload
    e.preventDefault();

    // 2. Check if the data is true, if so create a new fact
    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      // 3. Create a new fact object

      // const newFact = {
      //   id: Math.round(Math.random() * 100000000000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      setUploading(true);
      // 3. Upload facts to supabase and receive the new fact object
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setUploading(false);

      // 4. Add new fact object in the UI: add fact to state
      if (!error) setFact((facts) => [newFact[0], ...facts]);
      else alert("Couldn't Upload The Fact, Try Again");

      // 5. Reset input fields
      setText("");
      setSource("");
      setCat("");

      // 6. Close the form
      setShowForm(false);
    }
  }
  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      Fact Form
      <input
        disabled={uploading}
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={uploading}
      />
      <select value={category} onChange={(e) => setCat(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name} disabled={uploading}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={uploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurCategory }) {
  return (
    <aside>
      <ul>
        <li className="category" key={"category"}>
          <button
            className="btn btn-all-categories"
            onClick={() => setCurCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li className="category" key={cat.name}>
            <button
              className="btn btn-category"
              style={{
                backgroundColor: cat.color,
              }}
              onClick={() => setCurCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFact }) {
  if (facts.length === 0)
    return (
      <p className="message">
        There are no facts yet for this yet. Create one! 😊
      </p>
    );
  return (
    <section>
      <ul className="facts_list">
        {facts.map((fact) => (
          <Fact key={fact.id} factObj={fact} setFact={setFact} /> // Props in react
        ))}
      </ul>
    </section>
  );
}

function Fact({ factObj, setFact }) {
  const [updating, setUpdating] = useState(false);
  const isDisputed =
    factObj.votesInteresting + factObj.votesMindblowing < factObj.votesFalse;
  async function handleVote(colName) {
    setUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [colName]: factObj[colName] + 1 })
      .eq("id", factObj.id)
      .select();

    setUpdating(false);

    if (!error) {
      setFact((facts) =>
        facts.map((fact) => (fact.id === factObj.id ? updatedFact[0] : fact))
      );
    }
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔ disputed]</span> : null}
        {factObj.text}
        <a className="source" href={factObj.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find(
            (cat) => cat.name === factObj.category
          ).color,
        }}
      >
        {/* {console.log(CATEGORIES.find((cat) => cat.name))} */}
        {factObj.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={updating}
        >
          👍 {factObj.votesInteresting}
        </button>
        <button onClick={() => handleVote("votesMindblowing")}>
          🤯 {factObj.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")}>
          ⛔️ {factObj.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
