'use client';
import { Box, Typography, Container, Grid, Card, CardMedia } from '@mui/material';

// Dummy gallery images matching what the user provided in dummy data
const galleryImages = [
  { src: '/gallery/dandiya1.jpg', title: 'Grand Dandiya 2026' },
  { src: '/gallery/dandiya2.jpg', title: 'Navratri Garba Festival' },
  { src: '/gallery/dandiya3.jpg', title: 'Dandiya Beats Night' },
  { src: '/gallery/past1.jpg', title: 'Concerts 2025' },
  { src: '/gallery/past2.jpg', title: 'Holi Celebration 2024' },
  { src: '/gallery/past3.jpg', title: 'Mega Garba Fest 2023' },
];

export default function GalleryPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2, textAlign: 'center' }}>
        Event Gallery
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mb: 6, textAlign: 'center' }}>
        Memories from our vibrant celebrations
      </Typography>

      <Grid container spacing={3}>
        {galleryImages.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardMedia
                component="img"
                height="300"
                image={image.src}
                alt={image.title}
                sx={{
                  // In case image isn't available, we use a colorful background placeholder
                  backgroundColor: '#778899', 
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
