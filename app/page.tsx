'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { useState } from "react";
import Spinner from "./components/Spinner";
import { toast } from "sonner";

function page() {

	const [projects , setProject] = useState([])

	const [isLoadingNewProject, setIsLoadingNewProject] = useState(false)

	const [isModalOpen , setIsModalOpen] = useState(false)


	const [modalData , setModalData] = useState({
		name : "",
		origin : ""
	})

	async function newProject() {
		const originRegex = /^https?:\/\/([a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?$/i;
		if(!modalData.name || !modalData.origin) {
			toast.error("Please fill all the fields")
			return
		}else if(originRegex.test(modalData.origin) === false) {
			toast.error("Please enter a valid URL")
			return
		}
		setIsLoadingNewProject(true)
		const response = await fetch("/api/newproject", {
			method: "POST",
			body: JSON.stringify({ name: "TEMDB", origin: "www.temdb.com" })
		})
		const result = await response.json()
		console.log(result)
		setIsModalOpen(false)
		setIsLoadingNewProject(false)
	}


	return (
		<div>
			<div className="w-[80vw] mx-auto mt-10">
				{/* Search and add new project */}
				<div className="flex items-center gap-3">
					<Input type="search" placeholder="Search Projects..." className="border-border bg-secondary-background" />
					{/* <Button className=" bg-white hover:bg-offwhite transition-all duration-200 text-black cursor-pointer font-semibold flex items-center gap-3 self-stretch">
						Add New Project
					</Button> */}
					<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
						<DialogTrigger className="bg-white button-class hover:bg-offwhite transition-all duration-200 text-black cursor-pointer font-semibold flex items-center gap-3 self-stretch px-3">
							Add New Project
						</DialogTrigger>
						<DialogContent className="bg-secondary-background">
							<DialogHeader>
								<DialogTitle className="text-white">Create A New Project</DialogTitle>
								<DialogDescription>
									Create A New project to start tracking Analytics
								</DialogDescription>
							</DialogHeader>
							<label htmlFor="projectName" className="text-muted font-medium">Project Name</label>
							<Input type="text" id="projectName"
								onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
								placeholder="Project Name" className="border-border bg-secondary-background text-white"/>
							<label htmlFor="projectOrigin" className="text-muted font-medium">Project Origin</label>
							<Input type="text" id="projectOrigin"
								onChange={(e) => setModalData({ ...modalData, origin: e.target.value })}
								placeholder="Ex: https://example.com" className="border-border bg-secondary-background text-white"/>
							<Button
								onClick={newProject}
								className="hover:bg-white hover:text-black font-medium cursor-pointer duration-300">
									{isLoadingNewProject ? <Spinner size="20" color="white"/> : "Create"}
								</Button>
						</DialogContent>
					</Dialog>
				</div>
				{/* Projects */}
				<div className="grid grid-cols-3 mt-5">
					<div className="text-white bg-secondary-background border-border border rounded-md p-4 hover:border-muted transition-colors cursor-pointer">
						<h1>TEMDB</h1>
						<h1 className="text-muted">www.temdb.com</h1>
					</div>
				</div>
			</div>
		</div>
	)
}

export default page