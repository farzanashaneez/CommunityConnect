
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Paper, IconButton } from '@mui/material';
import { Photo, Send, Clear } from '@mui/icons-material';
import { createPost } from '../../services/api';
import { useAppSelector } from '../../hooks/reduxStoreHook';
import { useCommunityContext } from '../../context/communityContext';

const PostSchema = Yup.object().shape({
  content: Yup.string().required('Post content is required'),
  images: Yup.array().of(Yup.mixed()).max(5, 'You can upload up to 5 images')
});

export default function NewPostBox() {
  const userState=useAppSelector(state=>state.user)
  const {addedPost,setPostUpdated}=useCommunityContext();
  return (
    <Paper elevation={3} className="p-4">
      <Formik
        initialValues={{ content: '', images: [] }}
        validationSchema={PostSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const formData = new FormData();
            formData.append('content', values.content);
            formData.append('author',userState?.currentUser.user.id)
            values.images.forEach((image) => {
              formData.append('images', image);
            });
            console.log('form data',formData,values.images)
          
            await createPost(formData);
            addedPost(true);
            setPostUpdated(true)
            resetForm();
          } catch (error) {
            console.error('Error creating post:', error);
            addedPost(false);

          }
          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              name="content"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="What's on your mind?"
              error={touched.content && errors.content}
              helperText={touched.content && errors.content}
              className="mb-4"
            />
            
            {values.images.length > 0 && (
              <div className="flex flex-wrap mb-4">
                {values.images.map((image, index) => (
                  <div key={index} className="relative mr-2 mb-2">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <IconButton
                      size="small"
                      className="absolute top-0 right-0 bg-white"
                      onClick={() => {
                        const newImages = [...values.images];
                        newImages.splice(index, 1);
                        setFieldValue('images', newImages);
                      }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                const files = event.currentTarget.files;
                if (files) {
                  const newImages = Array.from(files);
                  setFieldValue('images', [...values.images, ...newImages].slice(0, 5));
                }
              }}
              style={{ display: 'none' }}
              id="image-upload"
            />
            
            <div className="flex justify-between">
              <label htmlFor="image-upload">
                <Button
                  component="span"
                  startIcon={<Photo />}
                  variant="text"
                  disabled={values.images.length >= 5}
                >
                  Add Photo ({values.images.length}/5)
                </Button>
                
              </label>
              <Button
                type="submit"
                startIcon={<Send />}
                variant="text"
                disabled={isSubmitting || (!values.content.trim() && values.images.length === 0)}
              >
                Post
              </Button>
            </div>

            
            {errors.images && <div className="text-red-500 mt-2">{errors.images}</div>}
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
