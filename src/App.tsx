import { DrawCanva } from "./components/DrawCanva";
import { Form } from "./components/Form";

function App() {
  return (
    <main className="flex flex-col md:flex-row items-start justify-center min-h-screen w-full">
      <Form />
      <DrawCanva />
    </main>
  );
}

export default App;
