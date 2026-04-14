import { Button } from "@/components/ui/button"

const Home = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Home Page</h1>
        <p>Welcome to the Rental Management System</p>
        <div>
            <Button>Shadcn Button</Button>
        </div>
    </div>
  )
}

export default Home
