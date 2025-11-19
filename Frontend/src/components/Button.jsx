export function Button({ icon, label, onclick }) {
    return (
        <button type="submit" className="flex items-center justify-center gap-2 bg-background-primary hover:bg-background-primary/85 text-text-dark h-fit py-2 px-4 rounded-md cursor-pointer w-full md:w-fit mt-2 md:mt-0"
            onClick={onclick}>
            {icon}
            <span>{label}</span>
        </button>
    )
}