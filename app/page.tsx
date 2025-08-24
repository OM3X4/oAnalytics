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
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import { toast } from "sonner";
import Link from "next/link";

function page() {

	const [isLoading , setIsLoading] = useState(true)
	const [projects, setProjects] = useState([])

	const [isLoadingNewProject, setIsLoadingNewProject] = useState(false)

	const [isModalOpen, setIsModalOpen] = useState(false)


	const [modalData, setModalData] = useState({
		name: "",
		origin: ""
	})

	async function newProject() {
		const originRegex = /^https?:\/\/([a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?$/i;
		if (!modalData.name || !modalData.origin) {
			toast.error("Please fill all the fields")
			return
		} else if (originRegex.test(modalData.origin) === false) {
			toast.error("Please enter a valid URL")
			return
		}
		setIsLoadingNewProject(true)
		const response = await fetch("/api/newproject", {
			method: "POST",
			body: JSON.stringify({ name: modalData.name, origin: modalData.origin }),
		})
		const result = await response.json()
		setProjects(result.allRecords)
		setIsModalOpen(false)
		setIsLoadingNewProject(false)
	}

	useEffect(() => {
		const fetchProjects = async () => {
			const response = await fetch("/api/projects")
			const result = await response.json()
			console.log(result)
			setProjects(result.projects)
			setIsLoading(false)
		}
		fetchProjects()
	}, [])

	if(isLoading) {
		return <div className="w-screen h-screen flex items-center justify-center"><Spinner size="50" color="white"/></div>
	}


	if(projects.length == 0) {
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<p className="text-white">No Projects Found</p>
			</div>
		)
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
								placeholder="Project Name" className="border-border bg-secondary-background text-white" />
							<label htmlFor="projectOrigin" className="text-muted font-medium">Project Origin</label>
							<Input type="text" id="projectOrigin"
								onChange={(e) => setModalData({ ...modalData, origin: e.target.value })}
								placeholder="Ex: https://example.com" className="border-border bg-secondary-background text-white" />
							<Button
								onClick={newProject}
								className="hover:bg-white hover:text-black font-medium cursor-pointer duration-300">
								{isLoadingNewProject ? <Spinner size="20" color="white" /> : "Create"}
							</Button>
						</DialogContent>
					</Dialog>
				</div>
				{/* Projects */}
				<h1 className="text-white text-2xl font-medium mt-5">Projects</h1>
				<div className="grid grid-cols-3 mt-5 gap-5">
					{
						projects.map((project) => {
							return (
								<Link href={`/project/${(project as any).id}`} className="text-white bg-secondary-background border-border
									border rounded-md p-4 hover:border-muted transition-colors cursor-pointer
									flex flex-col gap-2">
									<h1>{(project as any)?.name}</h1>
									<h1 className="text-muted">{(project as any)?.origin}</h1>
									<h6><span className="text-muted">Created On: </span>{new Date((project as any)?.creation_date).toDateString()}</h6>
								</Link>
							)
						})
					}
				</div>
			</div>
		</div>
	)
}

export default page