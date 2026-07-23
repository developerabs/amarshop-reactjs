import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
interface BlogPost {
  id: number;
  title: string;
  category: string;
  content: string;
  slug: string;
  thumbnail: string;
  created_at: string;
}
import api from "../services/api";

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  return (
    <div>

    </div> 
  )
}
