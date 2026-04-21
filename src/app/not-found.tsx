import Link from "next/link";
const NotFound = () => {
  return (
    <div>
        404 - Page Not Found
        <Link href="/homePage">按我回首頁</Link>
    </div>
  )
}

export default NotFound;