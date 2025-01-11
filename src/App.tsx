export const App = () => (
  <div>
    <h1>Hello, World!</h1>

    <p>
      Lorem ipsum:{" "}
      <button
        type="button"
        onClick={() => {
          console.log("Hello, Bun!");

          fetch("/api/echo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: "Bun" }),
          }).then((response) => {
            response.json().then((json) => {
              alert(json.message);
            });
          });
        }}
      >
        Click me!
      </button>
    </p>
  </div>
);
