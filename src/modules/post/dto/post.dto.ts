export class CreatePostDto {
  title: string;
  content?: string;
  authorEmail: string;
}

export class PostResponseDTO {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
}
