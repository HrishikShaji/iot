"use client"
import type React from "react"
import { useTransition, useRef } from "react"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Label } from "@repo/ui/components/ui/label"
import { toast } from "sonner"
import { createTrailer } from "../actions/createTrailer"
import { Truck } from "@repo/ui/icons"

export default function CreateTrailerForm() {
	const [isPending, startTransition] = useTransition()
	const formRef = useRef<HTMLFormElement>(null)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		const name = formData.get("name") as string
		const vin = formData.get("vin") as string

		// Validation
		if (!name || name.trim().length === 0) {
			toast.error("Please enter a trailer name")
			return
		}

		if (!vin) {
			toast.error("vin number is required")
			return
		}

		startTransition(async () => {
			try {
				const result = await createTrailer({ name, vin })

				if (result.success) {
					toast.success("Trailer created successfully!", {
						description: `${result.trailer?.name} has been created.`
					})
					// Reset form using ref
					formRef.current?.reset()
				} else {
					toast.error("Failed to create trailer", {
						description: result.error || "Please try again."
					})
				}
			} catch (error) {
				toast.error("An unexpected error occurred", {
					description: "Please try again later."
				})
				console.error("Error creating trailer:", error)
			}
		})
	}

	return (
		<div>
			<div className="border-b border-border ">
				<div className="mx-auto max-w-5xl px-6 py-6 ">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="flex items-start gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
								<Truck className="h-7 w-7 text-primary-foreground" />
							</div>
							<div className="space-y-2">
								<h1 className="text-2xl  font-medium tracking-tight text-foreground ">
									Create Trailer
								</h1>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-16">
				<form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-2">
						<Label htmlFor="name" className="text-sm font-medium">
							Name
						</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="your trailer"
							required
							disabled={isPending}
							className="h-11"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="vin" className="text-sm font-medium">
							Vin Number
						</Label>
						<Input
							id="vin"
							name="vin"
							type="text"
							placeholder="vin number"
							required
							disabled={isPending}
							className="h-11"
						/>
					</div>
					<Button
						type="submit"
						disabled={isPending}
						className="w-full h-11 text-base font-medium"
					>
						{isPending ? "Creating trailer..." : "Create trailer"}
					</Button>
				</form>
			</div>
		</div>
	)
}
